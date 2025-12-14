import { db } from "@/db";
import { appSessions } from "@/db/schema";
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