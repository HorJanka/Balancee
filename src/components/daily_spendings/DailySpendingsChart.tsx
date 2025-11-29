import { DateTime } from "luxon";
import { ChartLineLinear } from "../ChartLineLinear";
import { getDailySpendingsWithSpendingLimits } from "./actions";

interface Props{
  year: number,
  month: number
}

export default async function DailySpendingsChart({year, month}: Props) {

  const dailySpendingsWithLimits = await getDailySpendingsWithSpendingLimits(year,month);

  const chartData = dailySpendingsWithLimits || [];

  const description = DateTime.fromObject({ year, month })
    .setLocale('hu')
    .toFormat('yyyy LLLL'); // e.g., "november 2025"

  return (
    <ChartLineLinear
      chartData={chartData}
      title="Napi költések"
      description={description}
      XAxisDataKey="day"
      limitDataKey="limit"
    />
  );
}
