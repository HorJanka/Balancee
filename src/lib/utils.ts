import { clsx, type ClassValue } from "clsx";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleInput = <T>(
  e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  setFormData: Dispatch<SetStateAction<T>>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const setState = <K extends keyof T, T>(
  name: K,
  value: T[K],
  setFormData: Dispatch<SetStateAction<T>>
) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
