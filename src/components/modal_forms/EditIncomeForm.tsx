"use client";

import {
  useState,
  FormEvent,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import styles from "./forms.module.css";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { updateExpenseAction } from "../MonthlyExpenses/actions";

type EditIncomeFormProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  initial: {
    id: number | string;
    amount: number;
    description?: string | null;
    occurredAt: Date;
  };
};

type IncomeFormState = {
  amount: string;
  description?: string;
  date?: Date;
};

type IncomeFormErrors = {
  amount: string;
  description: string;
  no: number;
};

export function EditIncomeForm({
  setOpen,
  initial,
}: EditIncomeFormProps): ReactNode {
  const router = useRouter();

  const [formData, setFormData] = useState<IncomeFormState>({
    amount: Math.abs(initial.amount).toString(),
    description: initial.description ?? "",
    date: undefined,
  });

  const [formErrors, setFormErrors] = useState<IncomeFormErrors>({
    amount: "",
    description: "",
    no: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): IncomeFormErrors {
    const errors: IncomeFormErrors = {
      amount: "",
      description: "",
      no: 0,
    };

    const value = Number(formData.amount);

    if (!formData.amount || isNaN(value) || value <= 0) {
      errors.amount = "Az összegnek pozitív számnak kell lennie.";
      errors.no++;
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = "A leírás legfeljebb 500 karakter lehet.";
      errors.no++;
    }

    return errors;
  }

  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();

    const errors = validate();
    setFormErrors(errors);
    if (errors.no > 0) return;

    setIsSubmitting(true);

    let occurredAt: Date = initial.occurredAt;

    if (formData.date) {
      occurredAt = DateTime.fromJSDate(formData.date).toUTC().toJSDate();
    }

    const parsedAmount = Number(formData.amount);
    const signedAmount = Math.abs(parsedAmount);

    await updateExpenseAction({
      id: Number(initial.id),
      amount: signedAmount,
      categoryId: null,
      description: formData.description || null,
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, amount: e.target.value }))
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <p className="self-end text-xs text-secondary-foreground">
            {500 - (formData.description?.length ?? 0)}
          </p>
        </div>
      </div>

      <div className={styles.field}>
        <Label className={styles.label}>Dátum:</Label>
        <DatePicker
          hidden={false}
          placeholder="Válassz dátumot"
          date={formData.date}
          onSelect={(date) =>
            setFormData((prev) => ({ ...prev, date: date ?? undefined }))
          }
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
