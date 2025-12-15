"use server"

import { db } from "@/db";
import { userDailyActivity } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";

type ActivityType = "LOGIN" | "ADD_EXPENSE" | "VIEW_STATS";

export default async function trackUserActivity(type: ActivityType) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return;

    const userId = session.user.id;

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD" formátum

    // Dinamikusan összeállítjuk, mit kell frissíteni
    let updateValues = {};

    if (type === "LOGIN") {
        updateValues = { hasLoggedIn: true };
    } else if (type === "ADD_EXPENSE") {
        // Itt a meglévő értéket növeljük eggyel
        updateValues = { expensesAdded: sql`${userDailyActivity.expensesAdded} + 1` };
    } else if (type === "VIEW_STATS") {
        updateValues = { hasViewedStats: true };
    }

    await db.insert(userDailyActivity)
        .values({
            userId,
            date: today,
            hasLoggedIn: type === "LOGIN",
            expensesAdded: type === "ADD_EXPENSE" ? 1 : 0,
            hasViewedStats: type === "VIEW_STATS",
        })
        .onConflictDoUpdate({
            target: [userDailyActivity.userId, userDailyActivity.date],
            set: updateValues,
        });
}