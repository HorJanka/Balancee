import DailySpendingsChart from "@/components/daily_spendings/DailySpendingsChart";
import { getCategories } from "@/components/modal_forms/send";
import MonthlySpendingsChart from "@/components/monthly_spendings/MonthlySpendingsChart";
import { SpendingLimitCard } from "@/components/spending_limit/SpendingLimitCard";
import TransactionsMenuBar from "@/components/TransactionsMenuBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "./actions/auth";
import MonthlyCategoryPage from "@/components/MonthlySpendingByCategories/MonthlySpendingByCategories";
import MonthlySpendingAndIncome from "@/components/MonthlySpendingAndIncome/MonthlySpendingAndIncome";
import MonthlyExpensesPage from "@/components/MonthlyExpenses/MonthlyExpenses";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }
  const categories = await getCategories();

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <SpendingLimitCard />
        <div className="flex flex-col gap-4 justify-center">
          <DailySpendingsChart />
          <MonthlySpendingsChart />
          <MonthlyCategoryPage />
          <MonthlySpendingAndIncome />
          <MonthlyExpensesPage />
        </div>
        Welcome
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2.5 rounded-lg font-medium hover:bg-red-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </form>
      </div>
      <TransactionsMenuBar categories={categories} />
    </div>
  );
}
