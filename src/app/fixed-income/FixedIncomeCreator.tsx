"use client"

import FormModal from "@/components/FormModal";
import { useState } from "react";
import FixedIncomeForm from "./FixedIncomeForm";

export default function FixedIncomeCreator() {
    const [open, setOpen] = useState(false);
    return (
        <FormModal
            buttonText="Új rendszeres bevétel"
            buttonVariant="default"
            title="Rendszeres bevétel létrehozása"
            open={open}
            setOpen={setOpen}
        >
            <FixedIncomeForm income={undefined} setOpen={setOpen} />
        </FormModal>
    );
}