"use client"

import FormModal from "@/components/FormModal";
import { useState } from "react";
import CategoryForm from "./CategoryForm";

export default function CategoryCreator() {
    const [open, setOpen] = useState(false);
    return (
        <FormModal
            buttonText="Új kategória"
            buttonVariant="default"
            title="Kategória létrehozása"
            open={open}
            setOpen={setOpen}
        >
            <CategoryForm category={undefined} setOpen={setOpen} />
        </FormModal>
    );
}