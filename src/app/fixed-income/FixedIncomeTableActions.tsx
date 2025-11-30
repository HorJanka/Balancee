"use client";

import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FixedIncomeColumn } from "./columns";
import { deleteFixedIncome } from "./action";
import FixedIncomeForm from "./FixedIncomeForm";

export function FixedIncomeTableActions({ income }: { income : FixedIncomeColumn }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    await deleteFixedIncome(income.id);
  }

  return (
    <div>
        <FormModal
        buttonText={<Pencil />}
        buttonVariant="ghost"
        title="Rendszeres bevétel módosítása"
        open={open}
        setOpen={setOpen}
        >
        <FixedIncomeForm income={income} setOpen={setOpen} />
        </FormModal>
        <Button variant="ghost" onClick={handleDelete}>
        <Trash2 />
        </Button>
    </div>
  );
}