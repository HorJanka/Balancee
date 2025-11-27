import { getSpendingLimitsByIsMonthly } from "./server/actions";
import { DailySpendingLimits } from "./ui/DailySpendingLimits";
import { MonthlySpendingLimits } from "./ui/MonthlySpendingLimits";

export async function SpendingLimitsLayout() {
  const dailyLimits = await getSpendingLimitsByIsMonthly(false);
  const monthlyLimits = await getSpendingLimitsByIsMonthly(true);

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full mt-8">
      <div className="w-full max-w-3xl">
        <DailySpendingLimits data={dailyLimits || []} />
      </div>

      <div className="w-full max-w-3xl">
        <MonthlySpendingLimits data={monthlyLimits || []} />
      </div>
    </div>
  );
}
