"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, gte, lte, lt, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDailySpendings(year: number, month: number) {
  // Get authenticated user
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if(!session) return;

  // Calculate start and end dates for the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  // Query transactions grouped by day
  const result = await db
    .select({
      day: sql<string>`EXTRACT(DAY FROM ${transactions.occurredAt})::text`.as("day"),
      totalSpending: sql<number>`ABS(SUM(${transactions.amount}))`.as("total_spending"),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.occurredAt, startDate),
        lt(transactions.occurredAt, endDate),
        lt(transactions.amount, 0) // Only negative amounts
      )
    )
    .groupBy(sql`EXTRACT(DAY FROM ${transactions.occurredAt})`)
    .orderBy(sql`EXTRACT(DAY FROM ${transactions.occurredAt})`);

  // Transform result to include all days of the month
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailySpendings = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString();
    const spending = result.find((r) => r.day === day);
    return {
      day,
      spending: Number(spending?.totalSpending) || 0,
    };
  });

  return dailySpendings;
}