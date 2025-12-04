"use server"

import { db } from "@/db";
import { monthlyIncome, ratings, spendingLimit, transactions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function getShouldRequestRating() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;

    // Check if user already has a rating
    const hasReview = await db
        .select()
        .from(ratings)
        .where(eq(ratings.userId, session.user.id));
    
    if (hasReview.length > 0) {
        return false;
    }

    // Count user's transactions
    const transactionCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(eq(transactions.userId, session.user.id));

    const numTransactions = Number(transactionCount[0].count);

    // If user has 5+ transactions, show rating
    if (numTransactions >= 5) {
        return true;
    }

    // Check if user has at least one of each: transaction, spending limit, monthly income
    const hasTransaction = numTransactions > 0;

    const spendingLimits = await db
        .select()
        .from(spendingLimit)
        .where(eq(spendingLimit.userId, session.user.id))
        .limit(1);

    const monthlyIncomes = await db
        .select()
        .from(monthlyIncome)
        .where(eq(monthlyIncome.userId, session.user.id))
        .limit(1);

    const hasSpendingLimit = spendingLimits.length > 0;
    const hasMonthlyIncome = monthlyIncomes.length > 0;

    // Show rating if user has at least one of each
    if (hasTransaction && hasSpendingLimit && hasMonthlyIncome) {
        return true;
    }

    return false;
}

export async function addRating(rating: number) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return;

    if(rating > 5 || rating < 1){
        throw new Error("Invalid rating number");
    }

    const result = await db
                        .insert(ratings)
                        .values({
                            userId: session.user.id,
                            rating: rating
                        });
    return { ok: true };
}