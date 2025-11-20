"use client"

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode, useState } from "react";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import styles from "./forms.module.css";

export default function IncomeForm() : ReactNode {
    // function recordIncome(formData) {
    //     //... logic later
    // }

    const [occasional, setOccasional] = useState(true);
    const [date, setDate] = useState<Date | undefined>(undefined);

    return <div>
            <form /*action={recordIncome}*/>
                <div className={styles.field}>
                    <Label htmlFor="amount" className={styles.label}>Összeg:</Label>
                    <Input type="number" name="amount" className={styles.input} />
                </div>
                <div className={styles.field}>
                    <Label className={styles.label} htmlFor="description">Leírás:</Label>
                    <Textarea name="description" className={styles.textarea}/>
                </div>
                <div className={styles.field}>
                    <div className="flex items-center gap-3 mb-6">
                        <Checkbox name="date" onClick={() => {setOccasional(!occasional)}}/>
                        <Label htmlFor="date">Havi rendszeres</Label>                    
                    </div>
                    <Label className={styles.label} hidden={occasional}>Érkezésének várható napja:</Label>
                    <DatePicker hidden={occasional} placeholder="Válassz dátumot" date={date} setDate={setDate} />
                </div>
                <Button variant="default" type="submit" className="float-right">Hozzáad</Button>
            </form>
        </div>;
}