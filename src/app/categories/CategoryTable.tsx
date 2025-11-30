"use client";
import { DataTable } from "@/components/DataTable";
import { CategoryColumn, columns } from "./columns";

export default function CategoryTable({ categories }: { categories: CategoryColumn[] }) {
  return (
    <div>
      <DataTable columns={columns} data={categories} pageSize={10} />
    </div>
  );
}
