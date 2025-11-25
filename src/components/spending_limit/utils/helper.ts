import { SpendingLimit } from "@/db/types";
import { DateTime } from "luxon";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { SpendingLimitColumn, SpendingLimitState } from "./types";

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
