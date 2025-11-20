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
import { ReactNode } from "react";
export default function FormModal({buttonText, buttonVariant, title, form} : 
  {buttonText : string, buttonVariant : VariantProps<typeof buttonVariants>["variant"], title: string, form: ReactNode}) : ReactNode {
  return (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant={buttonVariant}>{buttonText}</Button>
    </DrawerTrigger>
    <DrawerContent>
      <div>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="mx-11 mb-6 flex flex-row gap-2">
          <div className="grow">
            {form}
          </div>
          <DrawerClose asChild className="self-end">
            <Button variant="outline">Mégsem</Button>
          </DrawerClose>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
  );
}