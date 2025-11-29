"use server";

import { db } from "@/db";
import { spendingLimit, transactions } from "@/db/schema";
import { and, eq, gte, lt, lte, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DateTime } from "luxon";

export async function getDailySpendings(year: number, month: number) {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  // User timezone
  const tz = "Europe/Budapest";

  // Create start and end of month in user's timezone, then convert to UTC
  const startDate = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: tz }
  )
    .startOf("day")
    .toUTC();

  const endDate = startDate.plus({ months: 1 });

  // Query transactions grouped by LOCAL day of month
  const result = await db
    .select({
      day: sql<string>`
        EXTRACT(
          DAY FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(tz)}')
        )
      `.as("day"),
      totalSpending: sql<number>`ABS(SUM(${transactions.amount}))`.as(
        "total_spending"
      ),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.occurredAt, startDate.toJSDate()),
        lt(transactions.occurredAt, endDate.toJSDate()),
        lt(transactions.amount, 0) // only spendings
      )
    )
    .groupBy(
      sql`EXTRACT(DAY FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(
        tz
      )}'))`
    )
    .orderBy(
      sql`EXTRACT(DAY FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(
        tz
      )}'))`
    );

  // Convert query result into array for all days in the month
  const daysInMonth = new Date(year, month, 0).getDate();

  const dailySpendings = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString();
    const match = result.find((r) => r.day === day);

    return {
      day,
      spending: Number(match?.totalSpending) || 0,
    };
  });
  return dailySpendings;
}

export async function getDailySpendingLimits(year: number, month: number) {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  // User timezone
  const tz = "Europe/Budapest";

  // Get start and end of the month in the user's timezone
  const startOfMonth = DateTime.fromObject({ year, month, day: 1 }, { zone: tz });
  const endOfMonth = startOfMonth.endOf("month");

  // Convert to UTC for database query
  const startUTC = startOfMonth.toUTC().toJSDate();
  const endUTC = endOfMonth.toUTC().toJSDate();

  // Get all spending limits that overlap with the requested month
  const limits = await db
    .select()
    .from(spendingLimit)
    .where(
      and(
        eq(spendingLimit.userId, session.user.id),
        lte(spendingLimit.start, endUTC),
        gte(spendingLimit.end, startUTC),
        eq(spendingLimit.isMonthly, false)
      )
    );

  if (limits.length === 0) return [];

  // Expand each limit into daily entries
  const dailyLimits: Array<{ day: number; limit: number }> = [];

  for (const limit of limits) {
    const limitStart = DateTime.fromJSDate(limit.start, { zone: "utc" }).setZone(tz);
    const limitEnd = DateTime.fromJSDate(limit.end, { zone: "utc" }).setZone(tz);

    const actualStart = DateTime.max(limitStart.startOf("day"), startOfMonth);
    const actualEnd = DateTime.min(limitEnd.startOf("day"), endOfMonth);

    let currentDate = actualStart;
    while (currentDate <= actualEnd) {
      dailyLimits.push({ day: currentDate.day, limit: limit.limit });
      currentDate = currentDate.plus({ days: 1 });
    }
  }

  return dailyLimits.sort((a, b) => a.day - b.day);
}

export async function getDailySpendingsWithSpendingLimits(year: number, month: number) {
  const dailySpending = await getDailySpendings(year, month);
  const dailyLimits = await getDailySpendingLimits(year, month);

  // Create a map of day -> limit for quick lookup
  const limitsMap = new Map(
    dailyLimits?.map(item => [item.day.toString(), item.limit])
  );

  // Combine the data
  const combined = dailySpending?.map(spending => ({
    day: spending.day,
    spending: spending.spending,
    limit: limitsMap.get(spending.day) || null, // null if no limit set for that day
  }));

  return combined;
}