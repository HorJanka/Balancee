"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VariantProps } from "class-variance-authority";
import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./modal_forms/forms.module.css";

export default function FormModal({
  buttonText,
  buttonVariant,
  title,
  children,
  open,
  setOpen,
}: {
  buttonText: ReactNode;
  buttonVariant: VariantProps<typeof buttonVariants>["variant"];
  title: string;
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  return (
    <Drawer open={open} onOpenChange={(open) => setOpen(open)}>
      <DrawerTrigger asChild>
        <Button variant={buttonVariant}>{buttonText}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="mx-auto mb-6 max-h-[60vh] max-w-[40%] overflow-y-auto">
            {children}
            <DrawerClose asChild className={styles.cancel}>
              <Button variant="outline">Mégsem</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
