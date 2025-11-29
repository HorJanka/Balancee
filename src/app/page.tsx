import { getCategories } from "@/app/categories/actions";
import DailySpendingsChart from "@/components/daily_spendings/DailySpendingsChart";
import MonthChanger from "@/components/month_changer/MonthChanger";
import MonthlySpendingsChart from "@/components/monthly_spendings/MonthlySpendingsChart";
import { SpendingLimitCard } from "@/components/spending_limit/SpendingLimitCard";
import TransactionsMenuBar from "@/components/TransactionsMenuBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "./actions/auth";

interface HomeProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const categories = await getCategories();
  const params = await searchParams;

  // Default to current date if no search params
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <SpendingLimitCard />
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex justify-center">
            <MonthChanger />
          </div>
          <DailySpendingsChart year={year} month={month} />
          <MonthlySpendingsChart year={year} />
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
