import DailySpendingsChart from "@/components/daily_spendings/DailySpendingsChart";
import MonthChanger from "@/components/month_changer/MonthChanger";
import MonthlySpendingsChart from "@/components/monthly_spendings/MonthlySpendingsChart";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MonthlyCategoryPage from "@/components/MonthlySpendingByCategories/MonthlySpendingByCategories";
import MonthlySpendingAndIncome from "@/components/MonthlySpendingAndIncome/MonthlySpendingAndIncome";
import MonthlyExpensesPage from "@/components/MonthlyExpenses/MonthlyExpenses";

interface StatisticsProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function StatisticsPage({
  searchParams,
}: StatisticsProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const params = await searchParams;

  // Default to current date if no search params
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
  return (
    <div className="flex flex-col gap-6 w-full justify-center items-center">
      <MonthChanger />
      <DailySpendingsChart year={year} month={month} />
      <MonthlySpendingsChart year={year} />
      <MonthlyCategoryPage year={year} month={month} />
      <MonthlySpendingAndIncome year={year} />
      <MonthlyExpensesPage year={year} month={month} />
    </div>
  );
}
