import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionKpi } from "@/app/actions/session";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { sessionId } = await req.json();

  if (!sessionId) {
    // First case: Start a new session
    const [newSession] = await db.insert(appSessions).values({
      userId: session.user.id,
      startedAt: new Date(),
      lastHeartbeat: new Date(),
    }).returning({ id: appSessions.id });

    return NextResponse.json({ sessionId: newSession.id });
  } else {
    // Second case: Update existing session (Heartbeat)
    await db.update(appSessions)
      .set({ lastHeartbeat: new Date() })
      .where(eq(appSessions.id, sessionId));

    return NextResponse.json({ sessionId }); // Send back the same
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