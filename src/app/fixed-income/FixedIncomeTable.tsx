"use client";

import { DataTable } from "@/components/DataTable";
import { FixedIncomeColumn, columns } from "./columns";

export default function FixedIncomeTable({ incomes }: { incomes: FixedIncomeColumn[] }) {
  return (
    <div>
      <DataTable columns={columns} data={incomes} pageSize={10} />
    </div>
  );
}
