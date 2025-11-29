"use server"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoryTable from "./CategoryTable";
import CategoryCreator from "./CategoryCreator";
import { getCategories } from "./actions";
import { CategoryColumn } from "./columns";

export default async function CategoriesPage() {
    const categories = await getCategories() as CategoryColumn[];
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