"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import styles from "./forms.module.css";
import { ExpenseErrors, ExpenseState } from "./validation";
import { handleInputChange, setState } from "./helpers";
import { validateExpense } from "./validation";
import { DateTime } from "luxon";

import { useRouter } from "next/navigation";
import { updateExpenseAction } from "../MonthlyExpenses/actions";

type CategoryOption = { id: number | string; name: string };

type EditExpenseFormProps = {
  categories: CategoryOption[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  initial: {
    id: number | string;
    amount: number;
    categoryId?: number | null;
    description?: string | null;
    occurredAt: Date;
  };
};

export function EditExpenseForm({
  categories,
  setOpen,
  initial,
}: EditExpenseFormProps): ReactNode {
  const router = useRouter();

  const [formData, setFormData] = useState<ExpenseState>({
    amount: Math.abs(initial.amount).toString(),
    category: initial.categoryId ?? undefined,
    description: initial.description ?? undefined,
    other: true,
    date: initial.occurredAt ? new Date(initial.occurredAt) : undefined,
  });

  const [formErrors, setFormErrors] = useState<ExpenseErrors>({
    amount: "",
    category: "",
    description: "",
    date: "",
    no: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();

    const errors = validateExpense(formData);
    setFormErrors(errors);
    if (errors.no > 0) return;

    setIsSubmitting(true);

    const sendData = { ...formData };
    let occurredAt = initial.occurredAt;

    if (sendData.date) {
      occurredAt = DateTime.fromJSDate(sendData.date).toUTC().toJSDate();
    }

    const parsedAmount = Number(sendData.amount);
    const signedAmount = -Math.abs(parsedAmount);

    await updateExpenseAction({
      id: Number(initial.id),
      amount: signedAmount,
      categoryId: sendData.category ?? null,
      description: sendData.description ?? null,
      occurredAt,
    });

    setIsSubmitting(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.field}>
        <Label htmlFor="amount" className={styles.label}>
          Összeg:
        </Label>
        <p className={styles.error}>{formErrors.amount}</p>
        <Input
          type="number"
          name="amount"
          className={styles.input}
          value={formData.amount}
          onChange={(e) => handleInputChange(e, setFormData)}
        />
      </div>

      <div className={styles.field}>
        <Label className={styles.label} htmlFor="category">
          Kategória:
        </Label>
        <p className={styles.error}>{formErrors.category}</p>
        <Select
          name="category"
          data={categories}
          notFound="Nincs ilyen kategória"
          placeholder="Válassz kategóriát"
          setSelected={(selected) =>
            setState(
              "category",
              selected ? parseInt(selected.toString()) : undefined,
              setFormData
            )
          }
        />
      </div>

      <div className={styles.field}>
        <Label className={styles.label} htmlFor="description">
          Leírás:
        </Label>
        <p className={styles.error}>{formErrors.description}</p>
        <div className="flex max-w-[35rem] flex-col">
          <Textarea
            name="description"
            className={styles.textarea}
            maxLength={500}
            value={formData.description}
            onChange={(e) => handleInputChange(e, setFormData)}
          />
          <p className="self-end text-xs text-secondary-foreground">
            {500 - (formData.description?.length ?? 0)}
          </p>
        </div>
      </div>

      <div className={styles.field}>
        <div className="mb-3 flex items-center gap-3">
          <Label htmlFor="date">Dátum módosítása</Label>
        </div>
        <p hidden={!formData.other} className={styles.error}>
          {formErrors.date}
        </p>
        <DatePicker
          hidden={!formData.other}
          placeholder="Válassz dátumot"
          date={formData.date}
          onSelect={(date) => setState("date", date, setFormData)}
        />
      </div>

      <Button
        variant="default"
        type="submit"
        disabled={isSubmitting}
        className="mt-4"
      >
        Mentés
      </Button>
    </form>
  );
}
