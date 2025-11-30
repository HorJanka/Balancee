"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, FormEvent, ReactNode, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "@/components/modal_forms/forms.module.css";
import { validateFixedIncome } from "./helpers";
import { FixedIncomeState, FixedIncomeErrors } from "./helpers";
import { updateFixedIncome } from "./action";
import { handleInputChange} from "@/components/modal_forms/helpers";
import { FixedIncomeColumn } from "./columns";

export default function FixedIncomeForm({ setOpen, income = undefined } : { setOpen : Dispatch<SetStateAction<boolean>>, income : FixedIncomeColumn | undefined }) : ReactNode {

    const [formData, setFormData] = useState<FixedIncomeState>({
        amount: income?.amount.toString() ?? "",
        description: income?.description ?? undefined,
        expected_at: income?.expected_at.toString() ?? '',
        name: income?.name ?? ""
    });

    const [formErrors, setFormErrors] = useState<FixedIncomeErrors>({
        amount: "",
        description: "",
        expected_at: "",
        name: "",
        no: 0
    });

    async function recordIncome(e : FormEvent<HTMLElement>) {
        e.preventDefault();

        const errors = validateFixedIncome(formData);
        setFormErrors(errors);

        if(errors.no > 0) return;
        setOpen(false);

        // Send validated data to database
        await updateFixedIncome(formData, income?.id);
    }

    return <div>
            <form onSubmit={(e) => recordIncome(e)}>
                <div className={styles.field}>
                    <Label className={styles.label}>Megnevezés:</Label>
                    <p className={styles.error}>{formErrors.name}</p>
                    <Input type="text" name="name" maxLength={255} value={formData.name} className={styles.input} onChange={(e) => handleInputChange(e, setFormData)} />
                </div> 
                <div className={styles.field}>
                    <Label htmlFor="amount" className={styles.label}>Összeg:</Label>
                    <p className={styles.error}>{formErrors.amount}</p>
                    <Input type="number" value={formData.amount} name="amount" className={styles.input} onChange={(e) => handleInputChange(e, setFormData)} />
                </div>
                <div className={styles.field}>
                    <Label className={styles.label} htmlFor="description">Leírás:</Label>
                    <p className={styles.error}>{formErrors.description}</p>
                    <div className="flex flex-col max-w-[35rem]">
                        <Textarea name="description" className={styles.textarea} onChange={(e) => handleInputChange(e, setFormData)} maxLength={500}/>
                        <p className="text-secondary-foreground text-xs self-end">{(500 - ((formData.description?.length) ? formData.description.length : 0))}</p>
                    </div>
                </div>
                <div className={styles.field}>
                    <Label className={styles.label}>A hónap ezen napján érkezik:</Label>
                    <p className={styles.error}>{formErrors.expected_at}</p>
                    <Input type="number" name="expected_at" value={formData.expected_at} className={styles.input} onChange={(e) => handleInputChange(e, setFormData)} />
                </div>               
                <Button variant="default" type="submit" className="fixed bottom-6 left-[75%]">Hozzáad</Button>
            </form>
        </div>;
}