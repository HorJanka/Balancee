import { ChartLineLinear } from "../ChartLineLinear";
import { getMonthlySpendings } from "./actions";

export default async function MonthlySpendingsChart() {
  const year = new Date().getFullYear();
  const userTransactions = await getMonthlySpendings(year);

  const chartData = userTransactions || [];

  return (
    <ChartLineLinear
      chartData={chartData}
      title="Havi költések"
      description="2025"
      XAxisDataKey="month"
    />
  );
}
