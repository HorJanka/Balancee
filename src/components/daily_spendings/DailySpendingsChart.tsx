import { ChartLineLinear } from "../ChartLineLinear";
import { getDailySpendingsWithSpendingLimits } from "./actions";

interface Props{
  year: number,
  month: number
}

export default async function DailySpendingsChart({year, month}: Props) {

  const dailySpendingsWithLimits = await getDailySpendingsWithSpendingLimits(year,month);

  const chartData = dailySpendingsWithLimits || [];

  return (
    <ChartLineLinear
      chartData={chartData}
      title="Napi költések"
      description="November 2025"
      XAxisDataKey="day"
      limitDataKey="limit"
    />
  );
}
