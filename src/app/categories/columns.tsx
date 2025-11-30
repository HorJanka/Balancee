import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CategoryTableActions } from "./CategoryTableActions";
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

export type CategoryColumn = {
    id: number,
    name: string,
    description: string | undefined,
    color: string | undefined,
    icon: IconName | undefined,
    default: boolean
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
    accessorKey: "color",
    header: "Szín",
    cell: ({ row }) => {
      return (
        <div className="max-h-5 aspect-square rounded-sm" style={{backgroundColor: row.original.color ?? "transparent"}} />
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
