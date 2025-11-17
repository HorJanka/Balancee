import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
export default function FormModal({trigger, title, form} : Readonly<{
  title: string, form: React.ReactNode, trigger: React.ReactNode
}> ) {
  <Drawer>
    <DrawerTrigger>{trigger}</DrawerTrigger>
    <DrawerContent>
      <div>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div>
          {form}
        </div>
        <DrawerClose>
          <Button variant="outline">Mégsem</Button>
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
}