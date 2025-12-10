import { db } from "@/db";
import { appSessions } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getSessionKpi() {
  const result = await db
    .select({
      // 1. Every session count
      totalSessions: sql<number>`count(*)`,
      
      // 2. Average use time in seconds
      // (lastHeartbeat - startedAt) average
      averageDurationSeconds: sql<number>`
        avg(
          EXTRACT(EPOCH FROM (${appSessions.lastHeartbeat} - ${appSessions.startedAt}))
        )
      `
    })
    .from(appSessions);

  const stats = result[0];
  const avgSeconds = Math.round(stats.averageDurationSeconds || 0);
  const avgMinutes = (avgSeconds / 60).toFixed(1);

  return {
    totalSessions: stats.totalSessions,
    avgTimeSeconds: avgSeconds,
    avgTimeText: `${avgMinutes} perc`,
    // Check kpi status
    isGoalMet: avgSeconds <= 120 // 2 minutes = 120 seconds
  };
}