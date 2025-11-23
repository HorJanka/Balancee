"use client"

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, FormEvent, ReactNode, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import styles from "./forms.module.css";
import { IncomeState, IncomeErrors, validateIncome } from "./validation";
import { saveIncome } from "./send";
import { handleInputChange, setState } from "./helpers";

export default function IncomeForm({ setOpen } : { setOpen : Dispatch<SetStateAction<boolean>> }) : ReactNode {

    const [formData, setFormData] = useState<IncomeState>({
        amount: "",
        description: undefined,
        regular: false,
        day: '1',
        name: ""
    });

    const [formErrors, setFormErrors] = useState<IncomeErrors>({
        amount: "",
        description: "",
        day: "",
        name: "",
        no: 0
    });

    async function recordIncome(e : FormEvent<HTMLElement>) {
        e.preventDefault();

        const errors = validateIncome(formData);
        setFormErrors(errors);

        if(errors.no > 0) return;
        setOpen(false);

        // Send validated data to database
        await saveIncome(formData);
    }

    return <div>
            <form onSubmit={(e) => recordIncome(e)}>
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
                    <div className="flex items-center gap-3 mb-6">
                        <Checkbox name="date"
                            onClick={() => {
                                setState("regular", !formData.regular, setFormData);
                            }}
                            checked={formData.regular}
                        />
                        <Label htmlFor="date">Havi rendszeres</Label>                    
                    </div>
                    <div className="mb-6">
                        <Label className={styles.label} hidden={!formData.regular}>A hónap ezen napján érkezik:</Label>
                        <p className={styles.error} hidden={!formData.regular}>{formErrors.day}</p>
                        <Input hidden={!formData.regular} type="number" name="day" value={formData.day} className={styles.input} onChange={(e) => handleInputChange(e, setFormData)} />
                    </div>
                    <Label className={styles.label} hidden={!formData.regular}>Megnevezés:</Label>
                    <p className={styles.error} hidden={!formData.regular}>{formErrors.name}</p>
                    <Input hidden={!formData.regular} type="text" name="name" maxLength={255} value={formData.name} className={styles.input} onChange={(e) => handleInputChange(e, setFormData)} />
                </div>
                <Button variant="default" type="submit" className="fixed bottom-6 left-[75%]">Hozzáad</Button>
            </form>
        </div>;
}