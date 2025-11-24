import { getSpendingLimits } from "./actions";
import { DailySpendingLimits } from "./DailySpendingLimits";
import { MonthlySpendingLimits } from "./MonthlySpendingLimits";

export async function SpendingLimitsLayout() {
  const dailyLimits = await getSpendingLimits(false);
  const monthlyLimits = await getSpendingLimits(true);

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <div className="w-full max-w-3xl">
        <DailySpendingLimits data={dailyLimits || []} />
      </div>

      <div className="w-full max-w-3xl">
        <MonthlySpendingLimits data={monthlyLimits || []} />
      </div>
    </div>
  );
}
