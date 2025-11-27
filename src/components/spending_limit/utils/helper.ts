import { SpendingLimit } from "@/db/types";
import { DateTime } from "luxon";
import { SpendingLimitColumn, SpendingResultForLimit, Transaction } from "./types";

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

export const formatHUF = (value: number | undefined) => {
  if (value === undefined || value === null) return "0 Ft";
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
  }).format(value);
};

export function calculateLimitStatusAndSpending({
  userTransactions,
  limit,
  filterFn,
}: {
  userTransactions: Transaction[] | undefined;
  limit: number | undefined;
  filterFn?: (t: Transaction) => boolean;
}): SpendingResultForLimit {
  const spent =
    userTransactions?.reduce((sum, t) => (!filterFn || filterFn(t) ? sum + t.spending : sum), 0) ??
    0;

  if (!limit) {
    return {
      spent,
      remaining: 0,
      textColor: "text-muted-foreground",
      infoText: "Nincs megadva korlát",
    };
  }

  const remaining = Math.max(limit - spent, 0);
  const isOverLimit = spent > limit;

  return {
    spent,
    remaining,
    textColor: isOverLimit ? "text-destructive" : "text-primary",
    infoText: isOverLimit
      ? `${formatHUF(spent - limit)}-tal túllépve`
      : `még ${formatHUF(remaining)}`,
  };
}
