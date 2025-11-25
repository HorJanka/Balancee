"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DateTime } from "luxon";
import { Button } from "../../ui/button";
import { SpendingLimitTableActions } from "../ui/SpendingLimitTableActions";
import { SpendingLimitColumn } from "../utils/types";

export const columns: ColumnDef<SpendingLimitColumn>[] = [
  {
    accessorKey: "limit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Limit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "start",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kezdet
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { start, isMonthly } = row.original;
      const format = isMonthly ? "yyyy.MM." : "yyyy.MM.dd.";
      return DateTime.fromJSDate(start).toFormat(format);
    },
  },
  {
    accessorKey: "end",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Befejezés
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { end, isMonthly } = row.original;
      const format = isMonthly ? "yyyy.MM." : "yyyy.MM.dd.";
      return DateTime.fromJSDate(end).toFormat(format);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SpendingLimitTableActions spendingLimit={row.original} />,
  },
];
