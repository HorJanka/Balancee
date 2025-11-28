"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CategoryTableActions } from "./CategoryTableActions";
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

export type CategoryColumn = {
    id: number,
    name: string,
    description: string | null,
    color: string | null,
    icon: IconName | null
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "icon",
    header: "Ikon",
    cell: ({ row }) => {
      return (
        <DynamicIcon name={row.original.icon ?? "circle-question-mark"} />
      );
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Név
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: 'includesString',
    enableColumnFilter: true
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Leírás
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: 'includesString',
    enableColumnFilter: true
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryTableActions category={row.original} />,
  },
];
