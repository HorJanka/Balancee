"use server"

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { monthlyIncome, transactions } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq, and } from "drizzle-orm";
import { FixedIncomeState } from "./helpers";
import { MonthlyIncome } from "@/db/types";
import { DateTime } from "luxon";

export async function getFixedIncomes() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return [];

    const result = await db
        .select({
            id: monthlyIncome.id,
            name: monthlyIncome.name,
            description: monthlyIncome.description,
            amount: monthlyIncome.amount,
            expected_at: monthlyIncome.expectedAt
        })
        .from(monthlyIncome)
        .where(eq(monthlyIncome.userId, session.user.id));

    return result;
}

export async function deleteFixedIncome(id: number) {

    await db
        .delete(monthlyIncome)
        .where(eq(monthlyIncome.id, id));

    revalidatePath("/monthlyIncome");
}

export async function updateFixedIncome(income: FixedIncomeState, id?: number) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return;

    if (id) {
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

export async function addAllTransactionFromMonthlyIncome() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return [];

    let transactionsAdded = 0;

    const fixedIncomes = await db
        .select()
        .from(monthlyIncome)
        .where(eq(monthlyIncome.userId, session.user.id));

    // For loop
    for (const fixedIncome of fixedIncomes) {

        const expectedDay = fixedIncome.expectedAt;

        const latestTransaction = await db
            .select()
            .from(transactions)
            .where(
                eq(transactions.monthlyIncomeId, fixedIncome.id)
            )
            .orderBy(desc(transactions.occurredAt))
            .limit(1);

        // Determine the start month for creating transactions
        let startDate: DateTime;

        if (latestTransaction.length > 0) {
            startDate = DateTime.fromJSDate(latestTransaction[0].occurredAt).plus({ months: 1 });
        }
        else {
            startDate = DateTime.fromJSDate(fixedIncome.createdAt); // Start from the creation of the monthly income
        }

        const today = DateTime.now().setZone("Europe/Budapest");

        let iterDate = startDate;

        while (iterDate <= today) {
            const transactionDate = iterDate.set({ day: expectedDay });

            const exist = await db
                .select()
                .from(transactions)
                .where(
                    and(
                        eq(transactions.monthlyIncomeId, fixedIncome.id),
                        eq(transactions.occurredAt, transactionDate.toJSDate())
                    )
                )

            if (exist.length == 0 && transactionDate <= today) {
                await db
                    .insert(transactions)
                    .values({
                        userId: fixedIncome.userId,
                        monthlyIncomeId: fixedIncome.id,
                        amount: fixedIncome.amount,
                        occurredAt: transactionDate.toJSDate(),
                        description: `Rendszeres bevétel - ${fixedIncome.name}`,
                    })
                transactionsAdded++;
            }
            iterDate = iterDate.plus({ months: 1 });

        }

    }

    console.log("TRANSACTIONS ADDED:", transactionsAdded)

    return { ok: true };
}
