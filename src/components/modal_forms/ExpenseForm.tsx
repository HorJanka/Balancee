"use client"

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode, useState } from "react";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import styles from "./forms.module.css";

export default function ExpenseForm() : ReactNode {
    // function recordExpense(formData) {
    //     //... logic later
    // }

    const categories = [{id: "1", name: "Szolgáltatás"}, {id: "2", name: "Élelmiszer"}, {id: "3", name: "Szórakozás"}];
    const [otherDate, setOtherDate] = useState(true);
    const [selected, setSelected] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);

    return <div>
            <form /*action={recordExpense}*/>
                <div className={styles.field}>
                    <Label htmlFor="amount" className={styles.label}>Összeg:</Label>
                    <Input type="number" name="amount" className={styles.input} />
                </div>
                <div className={styles.field}>
                    <Label className={styles.label} htmlFor="category">Kategória:</Label>
                    <Select name="category" data={categories} notFound="Nincs ilyen kategória" placeholder="Válassz kategóriát" setSelected={setSelected} />
                </div>
                <div className={styles.field}>
                    <Label className={styles.label} htmlFor="description">Leírás:</Label>
                    <Textarea name="description" className={styles.textarea}/>
                </div>
                <div className={styles.field}>
                    <div className="flex items-center gap-3 mb-3">
                        <Checkbox name="date" onClick={() => {setOtherDate(!otherDate)}}/>
                        <Label htmlFor="date">Más dátum</Label>                    
                    </div>
                    <DatePicker hidden={otherDate} placeholder="Válassz dátumot" date={date} setDate={setDate} />
                </div>
                <Button variant="default" type="submit" className="float-right">Hozzáad</Button>
            </form>
        </div>;
}