import { getCategoriesOptions, getMonthlyExpenses } from "./actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MonthlyExpensesTable } from "../charts/MonthlyExpensesTable";

export default async function MonthlyExpensesPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return [];
  }

  const data = (await getMonthlyExpenses(year, month)) ?? [];

  const category = await getCategoriesOptions();

  return (
    <div>
      <MonthlyExpensesTable
        data={data}
        categories={category}
        title="Havi költések"
        subtitle={`${year}.${String(month).padStart(2, "0")}`}
      />
    </div>
  );
}
