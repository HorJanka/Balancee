"use server";

import { db } from "@/db";
import { spendingLimit } from "@/db/schema";
import { NewSpendingLimit } from "@/db/types";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { SpendingLimitColumn } from "./columns";
import { SpendingLimitState } from "./validation";

export async function getSpendingLimits(
  isMonthly: boolean
): Promise<SpendingLimitColumn[] | undefined> {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  // Query spending limits
  const result = await db
    .select({
      id: spendingLimit.id,
      limit: spendingLimit.limit,
      start: spendingLimit.start,
      end: spendingLimit.end,
    })
    .from(spendingLimit)
    .where(eq(spendingLimit.isMonthly, isMonthly));

  return result;
}

export async function addSpendingLimit(formData: SpendingLimitState, isMonthly: boolean) {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  // Insert new spending limit
  const newLimit: NewSpendingLimit = {
    userId: session.user.id,
    limit: Number(formData.limit),
    start: formData.start!,
    end: formData.end!,
    isMonthly: isMonthly,
  };

  await db.insert(spendingLimit).values(newLimit);

  // Path to the table so that it refreshes upon delete
  revalidatePath("/");
}

export async function deleteSpendingLimit(id: number) {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  // Delete spending limit
  await db.delete(spendingLimit).where(eq(spendingLimit.id, id));

  // Path to the table so that it refreshes upon delete
  revalidatePath("/");
}
