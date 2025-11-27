"use client";

import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteSpendingLimit } from "../server/actions";
import { SpendingLimitColumn } from "../utils/types";
import { SpendingLimitForm } from "./SpendingLimitForm";

type Props = {
  spendingLimit: SpendingLimitColumn;
};

export function SpendingLimitTableActions({ spendingLimit }: Props) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    await deleteSpendingLimit(spendingLimit.id);
  }

  return (
    <>
      <div>
        <FormModal
          buttonText={<Pencil />}
          buttonVariant="ghost"
          title="Korlát módosítása"
          open={open}
          setOpen={setOpen}
        >
          <SpendingLimitForm
            setOpen={setOpen}
            isMonthly={spendingLimit.isMonthly}
            isEditing={true}
            spendingLimit={spendingLimit}
          />
        </FormModal>
        <Button variant="ghost" onClick={handleDelete}>
          <Trash2 />
        </Button>
      </div>
    </>
  );
}
