"use client";

import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  addSpendingLimit,
  editSpendingLimit,
  getSpendingLimitsIntervalsByIsMonthly,
} from "../server/actions";
import { handleInput, setState } from "../utils/helper";
import { SpendingLimitColumn, SpendingLimitErrors, SpendingLimitState } from "../utils/types";
import { validateSpendingLimit } from "../utils/validation";

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  isMonthly: boolean;
  isEditing: boolean;
  spendingLimit?: SpendingLimitColumn; // only needed when editing an existing spending limit
};

export function SpendingLimitForm({ setOpen, isMonthly, isEditing, spendingLimit }: Props) {
  const [formData, setFormData] = useState<SpendingLimitState>({
    limit: isEditing && spendingLimit ? String(spendingLimit.limit) : "",
    start: isEditing && spendingLimit ? spendingLimit.start : undefined,
    end: isEditing && spendingLimit ? spendingLimit.end : undefined,
  });

  const [errors, setErrors] = useState<SpendingLimitErrors>({
    limit: "",
    start: "",
    end: "",
    other: "",
    interval: "",
    no: 0,
  });

  async function saveSpendingLimit(e: FormEvent<HTMLElement>) {
    e.preventDefault();

    const spendingLimitsIntervals = await getSpendingLimitsIntervalsByIsMonthly(isMonthly);
    const errors = validateSpendingLimit({
      formData,
      spendingLimitsIntervals,
      isEditing,
      spendingLimit,
    });
    setErrors(errors);

    if (errors.no > 0) return;
    setOpen(false);

    // Edit spending limit
    if (isEditing && spendingLimit) {
      const spendingLimitId = spendingLimit.id;
      await editSpendingLimit({ formData, spendingLimitId, isMonthly });
    } else {
      // Add spending limit
      await addSpendingLimit({ formData, isMonthly });
    }
  }

  return (
    <form onSubmit={saveSpendingLimit} className="flex flex-col items-start gap-8 p-2">
      {/* Limit */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="limit" className="">
          Limit:
        </Label>
        <p className="text-destructive text-xs">{errors.limit}</p>
        <Input
          type="number"
          name="limit"
          value={formData.limit}
          onChange={(e) => handleInput(e, setFormData)}
        />
      </div>

      {/* Start date */}
      <div>
        <p className="text-destructive text-xs">{errors.start}</p>
        <DatePicker
          hidden={false}
          placeholder="Válassz kezdő dátumot"
          date={formData.start}
          onSelect={(date) => setState("start", date, setFormData)}
        />
      </div>

      {/* End date */}
      <div className="">
        <p className="text-destructive text-xs">{errors.end}</p>
        <p className="text-destructive text-xs">{errors.other}</p>
        <DatePicker
          hidden={false}
          placeholder="Válassz vég dátumot"
          date={formData.end}
          onSelect={(date) => setState("end", date, setFormData)}
        />
      </div>

      <p className="text-destructive text-xs">{errors.interval}</p>

      <Button variant="default" type="submit" className="fixed bottom-6 left-[75%]">
        {spendingLimit ? "Mentés" : "Hozzáad"}
      </Button>
    </form>
  );
}
