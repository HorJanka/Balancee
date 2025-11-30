import MonthlyCategoryPage from "@/components/MonthlySpendingByCategories/MonthlySpendingByCategories";
import MonthlySpendingAndIncome from "@/components/MonthlySpendingAndIncome/MonthlySpendingAndIncome";
import MonthlyExpensesPage from "@/components/MonthlyExpenses/MonthlyExpenses";

export default async function Stats() {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="grid w-full gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex w-full">
            <MonthlyCategoryPage />
          </div>
          <div className="flex w-full">
            <MonthlySpendingAndIncome />
          </div>
        </div>

        <div className="w-full">
          <MonthlyExpensesPage />
        </div>
      </div>
    </div>
  );
}
