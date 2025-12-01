"use server";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FixedIncomeColumn } from "./columns";
import { getFixedIncomes } from "./action";
import FixedIncomeCreator from "./FixedIncomeCreator";
import FixedIncomeTable from "./FixedIncomeTable";

export default async function FixedIncomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const incomes = (await getFixedIncomes()) as FixedIncomeColumn[];
  return (
    <div className="m-10">
      <Card>
        <CardHeader className="flex flex-row justify-end">
          <FixedIncomeCreator />
        </CardHeader>
        <CardContent>
          <FixedIncomeTable incomes={incomes} />
        </CardContent>
      </Card>
    </div>
  );
}
