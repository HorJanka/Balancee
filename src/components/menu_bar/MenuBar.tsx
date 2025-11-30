import { ChartNoAxesColumn, SlidersHorizontal, Tag } from "lucide-react";
import Link from "next/link";

import { ReactNode } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { MobileMenu } from "./MobileMenu";
import { ProfileAvatar } from "./ProfileAvatar";

export type MenuItem = {
  name: string;
  href: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  {
    name: "Limitek",
    href: "/spending-limit",
    icon: <SlidersHorizontal className="mr-2 hover:text-primary-foreground" />,
  },
  {
    name: "Kategóriák",
    href: "/categories",
    icon: <Tag className="mr-2 hover:text-primary-foreground" />,
  },
  {
    name: "Statisztikák",
    href: "/statistics",
    icon: <ChartNoAxesColumn className="mr-2 hover:text-primary-foreground" />,
  },
];

export function MenuBar() {
  return (
    <nav className="flex justify-between items-center w-full">
      {/* Mobile menu */}
      <div className="md:hidden">
        <MobileMenu menuItems={menuItems} />
      </div>

      {/* Logo here maybe*/}
      <Link href="/" className="hidden md:flex font-medium text-2xl self-center hover:text-primary">
        Balancee
      </Link>

      {/* Desktop menu + Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex md:items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((menuItem) => (
                <NavigationMenuItem key={menuItem.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={menuItem.href}
                      className="flex mx-2 flex-row justify-center items-center border cursor-default font-medium hover:text-primary-foreground hover:bg-primary rounded-md"
                    >
                      {menuItem.icon}
                      {menuItem.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <ProfileAvatar />
      </div>
    </nav>
  );
}
