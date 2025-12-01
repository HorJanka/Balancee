import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { MenuItem } from "./MenuBar";

export function MobileMenu({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-fit pr-16">
        <SheetHeader>
          <SheetTitle className="text-3xl">
            <Link href="/" className="active:text-primary">
              Balancee
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-2 pt-6">
          {menuItems.map((menuItem) => {
            const Icon = menuItem.icon;
            return (
              <Link
                key={menuItem.href}
                href={menuItem.href}
                className="text-md font-medium active:text-primary"
              >
                <span className="flex items-center p-2 rounded-md hover:bg-gray-100">
                  <Icon className="mr-2" />
                  {menuItem.name}
                </span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
