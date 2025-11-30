"use server"

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { CategoryState } from "./CategoryForm";
import { revalidatePath } from "next/cache";

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
            icon: categories.icon,
            default: categories.isDefault
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
    const defaults = (await getCategories()).filter(item => item.default).map(item => item.id);

    if(defaults.includes(id))
        return;

    await db
        .delete(categories)
        .where(eq(categories.id, id));

    revalidatePath("/categories");
}

export async function updateCategories(category : CategoryState, id? : number) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return;

    if(id) {
        await db
            .update(categories)
            .set({
                name: category.name,
                description: category.description,
                icon: category.icon,
                color: category.color
            })
            .where(eq(categories.id, id));
        
        revalidatePath("/categories");
        return;
    }

    await db
            .insert(categories)
            .values({
                name: category.name,
                description: category.description,
                icon: category.icon,
                color: category.color,
                userId: session.user.id,
                isDefault: false
            });

    revalidatePath("/categories");
}