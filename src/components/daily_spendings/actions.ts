"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";
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
