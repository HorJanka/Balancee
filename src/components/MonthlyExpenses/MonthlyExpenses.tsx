import { MonthlyExpensesTable } from "../charts/MonthlyExpensesTable";
import { getMonthlyExpenses } from "./actions";

export default async function MonthlyExpensesPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const data = await getMonthlyExpenses(year, month);

  return (
    <div className="p-4">
      <MonthlyExpensesTable
        data={data}
        title="Havi költések"
        subtitle={`${year}.${String(month).padStart(2, "0")}`}
      />
    </div>
  );
}
