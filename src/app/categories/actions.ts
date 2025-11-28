"use server"

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCategories() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return [];

    const result = await db
        .select({
            id: categories.id,
            name: categories.name,
            description : categories.description,
            color: categories.color,
            icon: categories.icon
        })
        .from(categories)
        .where(or(
            eq(categories.userId, session.user.id),
            categories.isDefault
        ));

    return result;
}

export async function getCategoriesSelect() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return [];

    const result = await db
        .select({
            id: categories.id,
            name: categories.name
        })
        .from(categories)
        .where(or(
            eq(categories.userId, session.user.id),
            categories.isDefault
        ));

    return result;
}

export async function deleteCategory(id : number) {

}