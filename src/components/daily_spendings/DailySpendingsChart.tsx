import { ChartLineLinear } from "../ChartLineLinear";
import { getDailySpendingsWithSpendingLimits } from "./actions";

export default async function DailySpendingsChart() {

  const dailySpendingsWithLimits = await getDailySpendingsWithSpendingLimits(2025,11);

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
