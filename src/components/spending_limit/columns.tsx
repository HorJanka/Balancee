"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteSpendingLimit } from "./actions";

export type SpendingLimitColumn = {
  id: number;
  limit: number;
  start: Date;
  end: Date;
};

export const columns: ColumnDef<SpendingLimitColumn>[] = [
  {
    accessorKey: "limit",
    header: "Limit",
  },
  {
    accessorKey: "start",
    header: "Kezdet",
  },
  {
    accessorKey: "end",
    header: "Befejezés",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const spendingLimit = row.original;

      async function handleDelete() {
        await deleteSpendingLimit(spendingLimit.id);
      }

      return (
        <div>
          <Button variant="ghost">
            <Pencil />
          </Button>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
