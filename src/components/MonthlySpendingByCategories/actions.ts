"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getMonthlyCategorySpendings(year: number, month: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const tz = "Europe/Budapest";

  const start = DateTime.fromObject({ year, month, day: 1 }, { zone: tz })
    .startOf("month")
    .toUTC();
  const end = start.plus({ months: 1 });

  const result = await db
    .select({
      categoryId: categories.id,
      category: sql<string>`
        COALESCE(${categories.name}, 'Uncategorized')
      `.as("category"),
      value: sql<number>`SUM(-${transactions.amount})`.as("value"),
    })
    .from(transactions)
    .leftJoin(categories, eq(categories.id, transactions.categoryId))
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.occurredAt, start.toJSDate()),
        lt(transactions.occurredAt, end.toJSDate()),
        lt(transactions.amount, 0)
      )
    )
    .groupBy(categories.id, categories.name)
    .orderBy(sql`SUM(-${transactions.amount}) DESC`);

  console.log("QUERY RESULT:", result);

  return result.map((r) => ({
    categoryId: r.categoryId,
    category: r.category,
    value: Number(r.value) || 0,
  }));
}
