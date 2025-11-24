"use server"
import { db } from "../../db/index";
import { transactions, categories, monthlyIncome } from "@/db/schema";
import { ExpenseState, IncomeState } from "./validation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";

export async function saveIncome(formData : IncomeState) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return;

    if(formData.regular) {
        await db
            .insert(monthlyIncome)
            .values({
                userId: session.user.id,
                amount: parseInt(formData.amount),
                expectedAt: parseInt(formData.day),
                description: formData.description,
                name: formData.name
            });
    } else {
        await db
            .insert(transactions)
            .values({
                userId: session.user.id,
                amount: parseInt(formData.amount),
                categoryId: null,
                occurredAt: DateTime.now().toUTC().toJSDate(),
                description: formData.description
            });
    }
}

export async function saveExpense(formData : ExpenseState) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return;
  
    await db
            .insert(transactions)
            .values({
                userId: session.user.id,
                amount: -parseInt(formData.amount),
                categoryId: formData.category,
                occurredAt: (formData.other && formData.date) ? formData.date : DateTime.now().toUTC().toJSDate(),
                description: formData.description
            });
    
    // Revalidate the page to refresh the charts
    revalidatePath("/");
}

export async function getCategories() {
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