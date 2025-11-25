import { getSpendingLimitsByIsMonthly } from "./server/actions";
import { DailySpendingLimits } from "./ui/DailySpendingLimits";
import { MonthlySpendingLimits } from "./ui/MonthlySpendingLimits";
import { mapSpendingLimitToSpendingLimitColumn } from "./utils/helper";

export async function SpendingLimitsLayout() {
  const dailyLimits = await getSpendingLimitsByIsMonthly(false);
  const mappedDailyLimits = dailyLimits?.map((limit) =>
    mapSpendingLimitToSpendingLimitColumn(limit)
  );

  const monthlyLimits = await getSpendingLimitsByIsMonthly(true);
  const mappedMonthlyLimits = monthlyLimits?.map((limit) =>
    mapSpendingLimitToSpendingLimitColumn(limit)
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full mt-8">
      <div className="w-full max-w-3xl">
        <DailySpendingLimits data={mappedDailyLimits || []} />
      </div>

      <div className="w-full max-w-3xl">
        <MonthlySpendingLimits data={mappedMonthlyLimits || []} />
      </div>
    </div>
  );
}
