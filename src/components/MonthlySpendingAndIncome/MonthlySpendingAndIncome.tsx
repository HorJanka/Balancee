import { getMonthlySummary } from "./actions";
import { MonthlySpendingAndIncomeBarChart } from "../charts/MonthlySpendingAndIncomeBarChart";

export default async function YearlySummaryPage() {
  const now = new Date();
  const year = now.getFullYear();

  const data = await getMonthlySummary(year);

  return (
    <div>
      <MonthlySpendingAndIncomeBarChart data={data} year={year} />
    </div>
  );
}
