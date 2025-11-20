"use client"
import { Calendar as CalendarIcon } from "lucide-react";
import { Dispatch, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SetStateAction } from "react";

export function DatePicker({ placeholder, hidden, date, setDate } : { placeholder : string, hidden : boolean, date : Date | undefined, setDate : Dispatch<SetStateAction<Date | undefined>> }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3" hidden={hidden}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : placeholder}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
