import { cn } from "@/lib/utils";
import { getDailySpendings } from "../daily_spendings/actions";
import { Card, CardContent } from "../ui/card";
import { getSpendingLimitByIsMonthly } from "./server/actions";
import { calculateLimitStatusAndSpending, formatHUF } from "./utils/helper";

export async function SpendingLimitCard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const userTransactions = await getDailySpendings(year, month);
  const monthlyLimit = await getSpendingLimitByIsMonthly(true);
  const dailyLimit = await getSpendingLimitByIsMonthly(false);

  // Daily limit calculations
  const daily = calculateLimitStatusAndSpending({
    userTransactions,
    limit: dailyLimit,
    filterFn: (t) => Number(t.day) === day,
  });
  // Monthly limit calculations
  const monthly = calculateLimitStatusAndSpending({ userTransactions, limit: monthlyLimit });

  return (
    <Card className="relative">
      <CardContent>
        {/* Daily limit */}
        <div className="flex flex-col pb-2 pr-8">
          <div className="flex justify-between items-center gap-10">
            <span className="text-md font-semibold">Napi korlát</span>
            <span className={cn("text-xs", daily.textColor)}>{daily.infoText}</span>
          </div>
          <p className="flex gap-2 text-2xl font-semibold pl-8">
            <span className={cn("", daily.textColor)}>{formatHUF(dailyLimit) ?? "-------"}</span>
            <span className="text-muted-foreground"> / {formatHUF(daily.spent)}</span>
          </p>
        </div>

        <div className="border-t" />

        {/* Monthly limit */}
        <div className="flex flex-col pt-2 pr-8">
          <div className="flex justify-between items-center gap-10">
            <span className="text-md font-semibold">Havi korlát</span>
            <span className={cn("text-xs", monthly.textColor)}>{monthly.infoText}</span>
          </div>
          <p className="flex gap-2 text-2xl font-semibold pl-8">
            <span className={cn("", monthly.textColor)}>
              {formatHUF(monthlyLimit) ?? "-------"}
            </span>
            <span className="text-muted-foreground">/ {formatHUF(monthly.spent)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
