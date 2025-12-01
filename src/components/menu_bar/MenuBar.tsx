import { BanknoteArrowDown, ChartNoAxesColumn, SlidersHorizontal, Tag } from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";
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
  icon: ComponentType<{ className?: string }>;
};

const menuItems: MenuItem[] = [
  {
    name: "Limitek",
    href: "/spending-limit",
    icon: SlidersHorizontal,
  },
  {
    name: "Kategóriák",
    href: "/categories",
    icon: Tag,
  },
  {
    name: "Statisztikák",
    href: "/statistics",
    icon: ChartNoAxesColumn,
  },
  {
    name: "Rendszeres bevétel",
    href: "/fixed-income",
    icon: BanknoteArrowDown,
  },
];

export function MenuBar() {
  return (
    <nav className="flex justify-between items-center w-full">

      {/* Mobile menu */}
      <div className="md:hidden">
        <MobileMenu menuItems={menuItems} />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="hidden md:flex font-medium text-2xl self-center hover:text-primary"
      >
        Balancee
      </Link>

      {/* Desktop menu */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex md:items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((menuItem) => {
                const Icon = menuItem.icon;
                return (
                  <NavigationMenuItem key={menuItem.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={menuItem.href}
                        className="flex mx-2 flex-row justify-center items-center border cursor-pointer font-medium hover:text-primary-foreground hover:bg-primary rounded-md px-3 py-2"
                      >
                        <Icon className="mr-2" />
                        {menuItem.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <ProfileAvatar />
      </div>
    </nav>
  );
}
