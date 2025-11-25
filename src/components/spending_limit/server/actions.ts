"use server";

import { db } from "@/db";
import { spendingLimit } from "@/db/schema";
import { NewSpendingLimit, SpendingLimit } from "@/db/types";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getDayEnd, getDayStart, getMonthEnd, getMonthStart } from "../utils/helper";
import { SpendingLimitsIntervals, SpendingLimitState } from "../utils/types";

// Helper functions
async function getSessionOrReturn() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

export async function getSpendingLimitsByIsMonthly(
  isMonthly: boolean
): Promise<SpendingLimit[] | undefined> {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  // Query spending limits
  const result = await db
    .select()
    .from(spendingLimit)
    .where(eq(spendingLimit.isMonthly, isMonthly));

  // Sorted DESC by start date
  const sortedResult = [...result].sort((a, b) => a.start.getTime() - b.start.getTime());

  return result;
}

export async function getSpendingLimitsIntervalsByIsMonthly(
  isMonthly: boolean
): Promise<SpendingLimitsIntervals[] | undefined> {
  // Get authenticated user
  const session = await getSessionOrReturn();
  if (!session) return;

  // Query spending limits
  const result = await db
    .select({ start: spendingLimit.start, end: spendingLimit.end })
    .from(spendingLimit)
    .where(eq(spendingLimit.isMonthly, isMonthly));

  return result;
}

// export async function getSpendingLimitById(
//   spendingLimitId: number
// ): Promise<SpendingLimit | undefined> {
//   // Get authenticated user
//   const session = await getSessionOrReturn();
//   if (!session) return;

//   // Get spending limit by id
//   const result = await db.select().from(spendingLimit).where(eq(spendingLimit.id, spendingLimitId));

//   return result[0];
// }

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
