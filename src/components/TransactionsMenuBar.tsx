"use client"

import { useState } from "react";
import FormModal from "./FormModal";
import ExpenseForm from "./modal_forms/ExpenseForm";
import IncomeForm from "./modal_forms/IncomeForm";

export default function TransactionsMenuBar({categories} : { categories : {id : string | number, name : string}[]}) {
    const [expenseOpen, setExpenseOpen] = useState(false);
    const [incomeOpen, setIncomeOpen] = useState(false);

    return (
        <div className="fixed bottom-0 bg-muted h-fit px-6 py-4 w-full flex flex-row gap-4">
            <FormModal
            title="Költés felvétele"
            buttonText="Költés felvétele"
            buttonVariant="default"
            open={expenseOpen}
            setOpen={setExpenseOpen}>
                <ExpenseForm categories={categories} setOpen={setExpenseOpen}/>
            </FormModal>
            <FormModal
            title="Bevétel felvétele"
            buttonText="Bevétel felvétele"
            buttonVariant="outline"
            open={incomeOpen}
            setOpen={setIncomeOpen}>
                <IncomeForm setOpen={setIncomeOpen} />
            </FormModal>
        </div>
    );
}