import { SpendingLimitsLayout } from "@/components/spending_limit/SpendingLimitsLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SpendingLimitPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  return <SpendingLimitsLayout />;
}
