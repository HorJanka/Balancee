import { ChartLineLinear } from "../ChartLineLinear";
import { getMonthlySpendings } from "./actions";

interface Props{
  year: number
}

export default async function MonthlySpendingsChart({year}:Props) {
  const userTransactions = await getMonthlySpendings(year);

  const chartData = userTransactions || [];

  return (
    <ChartLineLinear
      chartData={chartData}
      title="Havi költések"
      description={year.toString()}
      XAxisDataKey="month"
    />
  );
}
