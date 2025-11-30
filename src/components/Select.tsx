"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Select({
  data,
  notFound,
  placeholder,
  name,
  setSelected,
  value,
}: {
  data: { id: string | number; name: string }[];
  notFound: string;
  placeholder: string;
  name: string;
  setSelected: (value: number | string | undefined) => void;
  value: number | string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          name={name}
        >
          {value ? data.find((dat) => dat?.id === value)?.name : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
            <CommandGroup>
              {data.map((dat) => (
                <CommandItem
                  key={dat?.id}
                  value={dat?.name}
                  onSelect={(currentValue) => {
                    setSelected(currentValue === value ? undefined : dat?.id);
                    setOpen(false);
                  }}
                >
                  {dat?.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === dat?.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
