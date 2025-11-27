"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { headers } from "next/headers";

export async function getMonthlySpendings(year: number) {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  // User timezone
  const tz = "Europe/Budapest";

  // Create start and end of month in user's timezone, then convert to UTC
  const startDate = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: tz })
    .startOf("year")
    .toUTC();

  const endDate = startDate.plus({ year: 1 });

  // Query transactions grouped by LOCAL month
  const result = await db
    .select({
      month: sql<string>`
        EXTRACT(
          MONTH FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(tz)}')
        )
      `.as("month"),
      totalSpending: sql<number>`ABS(SUM(${transactions.amount}))`.as("total_spending"),
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
    .groupBy(sql`EXTRACT(MONTH FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(tz)}'))`)
    .orderBy(sql`EXTRACT(MONTH FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(tz)}'))`);

  // Convert query result into array for all days in the month
  const monthsInYear = 12;

  const monthlySpending = Array.from({ length: monthsInYear }, (_, i) => {
    const month = (i + 1).toString();
    const match = result.find((r) => r.month === month);

    return {
      month,
      spending: Number(match?.totalSpending) || 0,
    };
  });

  return monthlySpending;
}
