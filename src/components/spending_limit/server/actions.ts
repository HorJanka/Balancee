"use server";

import { db } from "@/db";
import { spendingLimit } from "@/db/schema";
import { NewSpendingLimit } from "@/db/types";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  getDayEnd,
  getDayStart,
  getMonthEnd,
  getMonthStart,
  mapSpendingLimitToSpendingLimitColumn,
} from "../utils/helper";
import { SpendingLimitColumn, SpendingLimitsIntervals, SpendingLimitState } from "../utils/types";

// Helper functions
async function getSessionOrReturn() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

// Array
export async function getSpendingLimitsByIsMonthly(
  isMonthly: boolean
): Promise<SpendingLimitColumn[] | undefined> {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  // Query spending limits
  const result = await db
    .select()
    .from(spendingLimit)
    .where(eq(spendingLimit.isMonthly, isMonthly))
    .orderBy(desc(spendingLimit.start));

  const mappedResult = result.map((limit) => mapSpendingLimitToSpendingLimitColumn(limit));

  return mappedResult;
}

// Singular
export async function getSpendingLimitByIsMonthly(isMonthly: boolean): Promise<number | undefined> {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  // Query spending limits
  const spendingLimits = await db
    .select()
    .from(spendingLimit)
    .where(eq(spendingLimit.isMonthly, isMonthly))
    .orderBy(desc(spendingLimit.start));

  const now = DateTime.now();
  const currentLimit = spendingLimits.find(
    (limit) => now >= DateTime.fromJSDate(limit.start) && now <= DateTime.fromJSDate(limit.end)
  );

  return currentLimit?.limit;
}

export async function getSpendingLimitsIntervalsByIsMonthly(
  isMonthly: boolean
): Promise<SpendingLimitsIntervals[] | undefined> {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  // Query spending limits
  const result = await db
    .select({ id: spendingLimit.id, start: spendingLimit.start, end: spendingLimit.end })
    .from(spendingLimit)
    .where(eq(spendingLimit.isMonthly, isMonthly))
    .orderBy(desc(spendingLimit.start));

  return result;
}

export async function addSpendingLimit({
  formData,
  isMonthly,
}: {
  formData: SpendingLimitState;
  isMonthly: boolean;
}) {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  let start = formData.start!;
  let end = formData.end!;

  // if the limit is monthly, then we save as if the user selected the first and last days of the months, same with daily but with days
  if (isMonthly) {
    start = getMonthStart(start);
    end = getMonthEnd(end);
  } else {
    start = getDayStart(start);
    end = getDayEnd(end);
  }

  // Insert new spending limit
  const newLimit: NewSpendingLimit = {
    userId: session.user.id,
    limit: Number(formData.limit),
    isMonthly: isMonthly,
    start,
    end,
  };

  await db.insert(spendingLimit).values(newLimit);

  // Path to the table so that it refreshes upon adding
  revalidatePath("/spending-limit");
}

export async function editSpendingLimit({
  formData,
  spendingLimitId,
  isMonthly,
}: {
  formData: SpendingLimitState;
  spendingLimitId: number;
  isMonthly: boolean;
}) {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  let start = formData.start!;
  let end = formData.end!;

  // if the limit is monthly, then we save as if the user selected the first and last days of the months, same with daily but with days
  if (isMonthly) {
    start = getMonthStart(start);
    end = getMonthEnd(end);
  } else {
    start = getDayStart(start);
    end = getDayEnd(end);
  }

  // Edit spending limit
  await db
    .update(spendingLimit)
    .set({
      limit: Number(formData.limit),
      start,
      end,
    })
    .where(eq(spendingLimit.id, spendingLimitId));

  // Path to the table so that it refreshes upon editing
  revalidatePath("/spending-limit");
}

export async function deleteSpendingLimit(spendingLimitId: number) {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  // Delete spending limit
  await db.delete(spendingLimit).where(eq(spendingLimit.id, spendingLimitId));

  // Path to the table so that it refreshes upon delete
  revalidatePath("/spending-limit");
}
