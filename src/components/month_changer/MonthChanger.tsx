"use client"

import { useState } from "react";
import { DateTime } from "luxon";
import { MonthPicker } from "../ui/monthpicker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function MonthChanger(){
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Initialize from URL params or default to current date
    const initialYear = searchParams.get('year');
    const initialMonth = searchParams.get('month');
    const initialDate = initialYear && initialMonth 
        ? new Date(parseInt(initialYear), parseInt(initialMonth) - 1)
        : undefined;
    
    const [date, setDate] = useState<Date | undefined>(initialDate);

    const formatDate = (date: Date) => {
        const dt = DateTime.fromJSDate(date).setLocale('hu');
        return `${dt.year} ${dt.toFormat('LLL')}`; // e.g., "2025 nov."
    };

    const handleMonthSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
            
            // Update URL with selected year and month
            router.push(`/?year=${year}&month=${month}`);
        }
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
                <MonthPicker onMonthSelect={handleMonthSelect} selectedMonth={date} />
            </PopoverContent>
        </Popover>
    );
}