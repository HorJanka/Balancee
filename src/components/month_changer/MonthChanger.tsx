"use client"

import { useState } from "react";
import { DateTime } from "luxon";
import { MonthPicker } from "../ui/monthpicker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MonthChanger(){
    const [date, setDate] = useState<Date>();

    const formatDate = (date: Date) => {
        const dt = DateTime.fromJSDate(date).setLocale('hu');
        return `${dt.year} ${dt.toFormat('LLL')}`; // e.g., "2025 nov."
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : <span>Pick a month</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <MonthPicker onMonthSelect={setDate} selectedMonth={date} />
            </PopoverContent>
        </Popover>
    );
}