"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { and, eq, gte, isNull, lt, or, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type UpdateExpenseInput = {
  id: number;
  amount: number;
  categoryId?: number | null;
  description?: string | null;
  occurredAt: Date;
};

export async function getMonthlyExpenses(year: number, month: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const tz = "Europe/Budapest";
  const start = DateTime.fromObject({ year, month, day: 1 }, { zone: tz })
    .startOf("month")
    .toUTC();
  const end = start.plus({ months: 1 });

  const rows = await db
    .select({
      id: transactions.id,
      categoryName: sql<string>`
        COALESCE(${categories.name}, 'Uncategorized')
      `.as("category_name"),
      description: transactions.description,
      amount: transactions.amount,
      occurredAt: transactions.occurredAt,
    })
    .from(transactions)
    .leftJoin(categories, eq(categories.id, transactions.categoryId))
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.occurredAt, start.toJSDate()),
        lt(transactions.occurredAt, end.toJSDate())
      )
    )
    .orderBy(transactions.occurredAt);

  return rows.map((r) => ({
    id: r.id,
    categoryName: r.categoryName,
    description: r.description,
    amount: Number(r.amount),
    occurredAt: new Date(r.occurredAt),
  }));
}

export async function deleteTransaction(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not authenticated");
  }

  await db
    .delete(transactions)
    .where(
      and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
    );

  return { ok: true };
}

export async function updateExpenseAction(input: UpdateExpenseInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  await db
    .update(transactions)
    .set({
      amount: input.amount,
      categoryId: input.categoryId ?? null,
      description: input.description ?? null,
      occurredAt: input.occurredAt,
    })
    .where(
      and(
        eq(transactions.id, input.id),
        eq(transactions.userId, session.user.id)
      )
    );

  return { ok: true };
}

export async function getCategoriesOptions() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return [];
  }

  const categoryRows =
    (await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(
        or(eq(categories.userId, session.user.id), isNull(categories.userId))
      )) ?? [];

  const categoryOptions = categoryRows.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return categoryOptions;
}
