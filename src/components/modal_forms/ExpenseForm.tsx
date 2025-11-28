"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import styles from "./forms.module.css";
import { ExpenseErrors, ExpenseState } from "./validation";
import { handleInputChange, setState } from "./helpers";
import { validateExpense } from "./validation";
import { saveExpense } from "./send";
import { DateTime } from "luxon";

export default function ExpenseForm({
  categories,
  setOpen,
}: {
  categories: { id: string | number; name: string }[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  const [formData, setFormData] = useState<ExpenseState>({
    amount: "",
    category: undefined,
    description: undefined,
    other: false,
    date: undefined,
  });

  const [formErrors, setFormErrors] = useState<ExpenseErrors>({
    amount: "",
    category: "",
    description: "",
    date: "",
    no: 0,
  });

  async function recordExpense(e: FormEvent<HTMLElement>) {
    e.preventDefault();

    const errors = validateExpense(formData);
    setFormErrors(errors);

    if (errors.no > 0) return;
    setOpen(false);

    const sendData = { ...formData };
    if (sendData.date) {
      sendData.date = DateTime.fromJSDate(sendData.date).toUTC().toJSDate();
    }

    await saveExpense(sendData);
  }

  return (
    <div>
      <form onSubmit={recordExpense}>
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
          <div className="flex flex-col max-w-[35rem]">
            <Textarea
              name="description"
              className={styles.textarea}
              maxLength={500}
              value={formData.description}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
            <p className="text-secondary-foreground text-xs self-end">
              {500 -
                (formData.description?.length
                  ? formData.description.length
                  : 0)}
            </p>
          </div>
        </div>
        <div className={styles.field}>
          <div className="flex items-center gap-3 mb-3">
            <Checkbox
              name="date"
              checked={formData.other}
              onClick={() => setState("other", !formData.other, setFormData)}
            />
            <Label htmlFor="date">Más dátum</Label>
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
          className="fixed bottom-6 left-[75%]"
        >
          Hozzáad
        </Button>
      </form>
    </div>
  );
}
