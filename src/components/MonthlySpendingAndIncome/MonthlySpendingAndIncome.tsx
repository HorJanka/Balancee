import { getMonthlySummary } from "./actions";
import { MonthlySpendingAndIncomeBarChart } from "../charts/MonthlySpendingAndIncomeBarChart";

interface Props {
  year: number;
}

export default async function YearlySummaryPage({ year }: Props) {
  const data = await getMonthlySummary(year);

  return (
    <div>
      <MonthlySpendingAndIncomeBarChart data={data} year={year} />
    </div>
  );
}
