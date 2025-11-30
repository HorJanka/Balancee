"use server"

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { monthlyIncome } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { FixedIncomeState } from "./helpers";

export async function getFixedIncomes() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return [];

    const result = await db
        .select({
            id: monthlyIncome.id,
            name: monthlyIncome.name,
            description : monthlyIncome.description,
            amount: monthlyIncome.amount,
            expected_at: monthlyIncome.expectedAt
        })
        .from(monthlyIncome)
        .where(eq(monthlyIncome.userId, session.user.id));

    return result;
}

export async function deleteFixedIncome(id : number) {

    await db
        .delete(monthlyIncome)
        .where(eq(monthlyIncome.id, id));

    revalidatePath("/monthlyIncome");
}

export async function updateFixedIncome(income : FixedIncomeState, id? : number) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) return;

    if(id) {
        await db
            .update(monthlyIncome)
            .set({
                name: income.name,
                description: income.description,
                amount: parseInt(income.amount),
                expectedAt: parseInt(income.expected_at)
            })
            .where(eq(monthlyIncome.id, id));
        
        revalidatePath("/monthlyIncome");
        return;
    }

    await db
            .insert(monthlyIncome)
            .values({
                name: income.name,
                description: income.description,
                amount: parseInt(income.amount),
                expectedAt: parseInt(income.expected_at),
                userId: session.user.id
            });

    revalidatePath("/monthlyIncome");
}