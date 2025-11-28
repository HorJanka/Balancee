"use server"

import { DataTable } from "../../components/DataTable"
import { getCategories } from "./actions"
import { CategoryColumn, columns } from "./columns";

export default async function CategoryTable() {
    const categories = await getCategories() as CategoryColumn[];

    return (
        <div>
            <DataTable columns={columns} data={categories} />
        </div>
    )
}