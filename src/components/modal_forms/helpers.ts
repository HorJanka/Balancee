import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FormState } from "./validation";

export const handleInputChange = <T extends FormState>(e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, setFormData : Dispatch<SetStateAction<T>>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
}

export const setState = <K extends keyof T, T extends FormState>(name : K, value : T[K], setFormData : Dispatch<SetStateAction<T>>) => {
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
}
