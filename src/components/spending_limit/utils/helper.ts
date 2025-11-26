import { SpendingLimit } from "@/db/types";
import { DateTime } from "luxon";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { SpendingLimitColumn, SpendingLimitState, SpendingResultForLimit } from "./types";

export const handleInput = <T extends SpendingLimitState>(
  e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  setFormData: Dispatch<SetStateAction<T>>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const setState = <K extends keyof T, T extends SpendingLimitState>(
  name: K,
  value: T[K],
  setFormData: Dispatch<SetStateAction<T>>
) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const mapSpendingLimitToSpendingLimitColumn = (
  spendingLimit: SpendingLimit
): SpendingLimitColumn => {
  return {
    id: spendingLimit.id,
    limit: spendingLimit.limit,
    start: spendingLimit.start,
    end: spendingLimit.end,
    isMonthly: spendingLimit.isMonthly,
  };
};

export function getMonthStart(date: Date): Date {
  return DateTime.fromJSDate(date).startOf("month").toJSDate();
}

export function getMonthEnd(date: Date): Date {
  return DateTime.fromJSDate(date).endOf("month").toJSDate();
}

export function getDayStart(date: Date): Date {
  return DateTime.fromJSDate(date).startOf("day").toJSDate();
}

export function getDayEnd(date: Date): Date {
  return DateTime.fromJSDate(date).endOf("day").toJSDate();
}

export function calculateDailyLimitStatus(
  userTransactions: { day: string; spending: number }[] | undefined,
  dailyLimit: number | undefined,
  day: number
): SpendingResultForLimit {
  const spent =
    userTransactions?.reduce(
      (sum, transaction) => (Number(transaction!.day) === day ? sum + transaction!.spending : sum),
      0
    ) ?? 0;
  if (!dailyLimit) {
    return {
      spent,
      remaining: 0,
      textColor: "text-muted-foreground",
      infoText: "Nincs megadva korlát",
    };
  }

  const remaining = Math.max(dailyLimit - spent, 0);

  const isOverLimit = spent > dailyLimit;

  const textColor = isOverLimit ? "text-destructive" : "text-primary";

  const infoText = isOverLimit ? `${spent - dailyLimit} Ft-tal túllépve` : `még ${remaining} Ft`;

  return {
    spent,
    remaining,
    textColor,
    infoText,
  };
}

export function calculateMonthlyLimitStatus(
  userTransactions: { day: string; spending: number }[] | undefined,
  monthlyLimit: number | undefined
): SpendingResultForLimit {
  const spent = userTransactions?.reduce((sum, transaction) => sum + transaction!.spending, 0) ?? 0;
  if (!monthlyLimit) {
    return {
      spent,
      remaining: 0,
      textColor: "text-muted-foreground",
      infoText: "Nincs megadva korlát",
    };
  }

  const remaining = Math.max(monthlyLimit - spent, 0);

  const isOverLimit = spent > monthlyLimit;

  const textColor = isOverLimit ? "text-destructive" : "text-primary";

  const infoText = isOverLimit ? `${spent - monthlyLimit} Ft-tal túllépve` : `még ${remaining} Ft`;

  return {
    spent,
    remaining,
    textColor,
    infoText,
  };
}
