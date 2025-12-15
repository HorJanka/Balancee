import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appSessions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSessionKpi } from "@/app/actions/analytics/kpi";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const sessionId = body.sessionId;
  const incrementBy = body.incrementBy || 0; // Start with 0, when new session is started

  if (!sessionId) {

    // Start new session
    const [newSession] = await db.insert(appSessions).values({
      userId: session.user.id,
      startedAt: new Date(),
      lastHeartbeat: new Date(),
    }).returning({ id: appSessions.id });

    return NextResponse.json({ sessionId: newSession.id });
  } else {

    // Increase the active time
    await db.update(appSessions)
      .set({ 
        lastHeartbeat: new Date(),
        activeSeconds: sql`${appSessions.activeSeconds} + ${incrementBy}`
      })
      .where(eq(appSessions.id, sessionId));

    return NextResponse.json({ sessionId });
  }
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const ADMIN_ID = process.env.ADMIN_USER_ID;

  if (session.user.id !== ADMIN_ID) {
    return new NextResponse("Forbidden: Access denied", { status: 403 });
  }

  try {
    const kpiData = await getSessionKpi();

    return NextResponse.json(kpiData);

  } catch (error) {
    console.error("KPI Calculation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}