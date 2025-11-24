"use client";

import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addSpendingLimit } from "./actions";
import { SpendingLimitErrors, SpendingLimitState, validateSpendingLimit } from "./validation";

export function SpendingLimitForm({
  setOpen,
  isMonthly,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  isMonthly: boolean;
}) {
  const [formData, setFormData] = useState<SpendingLimitState>({
    limit: "",
    start: undefined,
    end: undefined,
  });

  const [errors, setErrors] = useState<SpendingLimitErrors>({
    limit: "",
    start: "",
    end: "",
    other: "",
    no: 0,
  });

  const handleInput = <T extends SpendingLimitState>(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    setFormData: Dispatch<SetStateAction<T>>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setState = <K extends keyof T, T extends SpendingLimitState>(
    name: K,
    value: T[K],
    setFormData: Dispatch<SetStateAction<T>>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function saveSpendingLimit(e: FormEvent<HTMLElement>) {
    e.preventDefault();

    const errors = validateSpendingLimit(formData);
    setErrors(errors);

    if (errors.no > 0) return;
    setOpen(false);

    // Send validated data to database
    await addSpendingLimit(formData, isMonthly);
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
          className=""
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

      <Button variant="default" type="submit" className="fixed bottom-6 left-[75%]">
        Hozzáad
      </Button>
    </form>
  );
}
