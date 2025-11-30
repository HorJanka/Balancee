"use server";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CategoryCreator from "./CategoryCreator";
import CategoryTable from "./CategoryTable";
import { getCategories } from "./actions";
import { CategoryColumn } from "./columns";

export default async function CategoriesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const categories = (await getCategories()) as CategoryColumn[];
  return (
    <div className="m-10">
      <Card>
        <CardHeader className="flex flex-row justify-end">
          <CategoryCreator />
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
