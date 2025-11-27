import { ChartLineLinear } from "../ChartLineLinear";
import { getDailySpendings } from "./actions";

export default async function DailySpendingsChart() {
  const userTransactions = await getDailySpendings(2025, 11);

  const chartData = userTransactions || [];

  return (
    <ChartLineLinear
      chartData={chartData}
      title="Napi költések"
      description="November 2025"
      XAxisDataKey="day"
    />
  );
}
