"use server"

import { db } from "@/db";
import { appSessions,userDailyActivity } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getSessionKpi() {
  const result = await db
    .select({
      totalSessions: sql<number>`count(*)`,
      
      averageDurationSeconds: sql<number>`avg(${appSessions.activeSeconds})`
    })
    .from(appSessions);

  const stats = result[0];
  const avgSeconds = Math.round(stats.averageDurationSeconds || 0);
  const avgMinutes = (avgSeconds / 60).toFixed(1);

  return {
    totalSessions: stats.totalSessions,
    avgTimeSeconds: avgSeconds,
    avgTimeText: `${avgMinutes} minutes`,
    isGoalMet: avgSeconds <= 120
  };
}

export async function getDauMauRatio() {
  // How many users has logged in today
  const today = new Date().toISOString().split("T")[0];
  
  // How many users completed the 3 conditions in the last 30 days
  
  const query = sql`
    WITH metrics AS (
      SELECT
        -- DAU: Has a login happened today
        COUNT(DISTINCT CASE WHEN date = ${today} AND has_logged_in = true THEN user_id END) as dau_count,
        
        -- MAU: Last 30 days by users
        COUNT(DISTINCT user_id) FILTER (WHERE 
           -- Subquery logika szimulálása aggregációval
           user_id IN (
             SELECT user_id
             FROM ${userDailyActivity}
             WHERE date >= date(${today}) - INTERVAL '30 days'
             GROUP BY user_id
             HAVING 
               -- 1. Condition: Logged in this month
               BOOL_OR(has_logged_in) = true 
               AND 
               -- 2. Condition: Has atleast 3 expenses this month
               SUM(expenses_added) >= 3 
               AND 
               -- 3. Condition: Viewed the statistics page
               BOOL_OR(has_viewed_stats) = true
           )
        ) as mau_count
      FROM ${userDailyActivity}
      WHERE date >= date(${today}) - INTERVAL '30 days'
    )
    SELECT 
      dau_count, 
      mau_count,
      CASE WHEN mau_count > 0 
           THEN (dau_count::float / mau_count::float) * 100 
           ELSE 0 
      END as ratio
    FROM metrics;
  `;

  const result = await db.execute(query);
  const data = result.rows[0]; // { dau_count: 120, mau_count: 400, ratio: 30.0 }
  
  return {
      dau: Number(data.dau_count),
      mau: Number(data.mau_count),
      ratio: Number(data.ratio),
      isTargetMet: Number(data.ratio) >= 30
  };
}