"use client"

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { CategoryColumn } from "./columns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import styles from "../../components/modal_forms/forms.module.css";
import { handleInputChange, setState } from "@/components/modal_forms/helpers";
import { FormState } from "@/components/modal_forms/validation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { updateCategories } from "./actions";
import { getRandomColor } from "./helpers";

export interface CategoryState extends FormState {
    name: CategoryColumn["name"],
    description: CategoryColumn["description"],
    color: CategoryColumn["color"],
    icon: CategoryColumn["icon"],
}

export default function CategoryForm({category, setOpen} : {category : CategoryColumn | undefined, setOpen : Dispatch<SetStateAction<boolean>>}) {

    const [formData, setFormData] = useState<CategoryState>({
        name: category?.name ?? "",
        description: category?.description ?? "",
        color: category?.color ?? getRandomColor(),
        icon: category?.icon,
    });

    async function recordCategory(e : FormEvent<HTMLElement>) {
        e.preventDefault();
        setOpen(false);

        await updateCategories(formData, category?.id);
    }

    return (
        <div>
            <form onSubmit={recordCategory}>
                <div className={styles.field}>
                    <Label htmlFor="name" className={styles.label}>Név:</Label>
                    <Input type="text" id="name" name="name" className={styles.input} value={formData.name} onChange={(e) => handleInputChange(e, setFormData)} />
                </div>
                <div className={styles.field}>
                    <Label className={styles.label} htmlFor="description">Leírás:</Label>
                    <div className="flex flex-col max-w-[35rem]">
                        <Textarea name="description" className={styles.textarea} maxLength={1000} value={formData.description} onChange={(e) => handleInputChange(e, setFormData)}/>
                        <p className="text-secondary-foreground text-xs self-end">{(1000 - ((formData.description?.length) ? formData.description.length : 0))}</p>
                    </div>
                </div>
                <div className={`${styles.field} flex flex-row gap-4 items-center`}>
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor="icon">Ikon:</Label>
                        <IconPicker value={formData.icon ?? "circle-question-mark"} onValueChange={(ico) => setState("icon", ico, setFormData)} />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor="color">Szín:</Label>
                        <Input type="color" id="color" name="color" className={styles.input} value={formData.color} onChange={(e) => handleInputChange(e, setFormData)}/>
                    </div>
                </div>
                <Button variant="default" type="submit" className="fixed bottom-6 left-[75%]">Hozzáad</Button>
            </form>
        </div>
    );
}