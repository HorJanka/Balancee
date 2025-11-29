"use client";

import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "./actions";
import { CategoryColumn } from "./columns";
import CategoryForm from "./CategoryForm";

export function CategoryTableActions({ category }: { category : CategoryColumn }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    await deleteCategory(category.id);
  }

  return (
    <>
      {
      (category.default) ? 
        <></> 
        :
        <div>
          <FormModal
            buttonText={<Pencil />}
            buttonVariant="ghost"
            title="Kategória módosítása"
            open={open}
            setOpen={setOpen}
          >
            <CategoryForm category={category} setOpen={setOpen} />
          </FormModal>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>
      }      
    </>
  );
}