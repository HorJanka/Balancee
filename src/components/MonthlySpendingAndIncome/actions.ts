"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getMonthlySummary(year: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const tz = "Europe/Budapest";

  const start = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: tz })
    .startOf("year")
    .toUTC();
  const end = start.plus({ years: 1 });

  const monthExpr = sql<number>`
    EXTRACT(
      MONTH FROM (${transactions.occurredAt} AT TIME ZONE '${sql.raw(tz)}')
    )
  `;

  const rows = await db
    .select({
      month: monthExpr.as("month"),
      income: sql<number>`
        COALESCE(
          SUM(CASE WHEN ${transactions.amount} > 0 THEN ${transactions.amount} ELSE 0 END),
          0
        )
      `.as("income"),
      expense: sql<number>`
        COALESCE(
          SUM(CASE WHEN ${transactions.amount} < 0 THEN -${transactions.amount} ELSE 0 END),
          0
        )
      `.as("expense"),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.occurredAt, start.toJSDate()),
        lt(transactions.occurredAt, end.toJSDate())
      )
    )
    .groupBy(monthExpr)
    .orderBy(monthExpr);

  const result = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const row = rows.find(
      (r) => Number(r.month) === m || String(r.month) === String(m)
    );

    const income = row ? Number(row.income) : 0;
    const expense = row ? Number(row.expense) : 0;
    const balance = income - expense;

    return {
      month: m,
      income,
      expense,
      balance,
    };
  });

  return result;
}
