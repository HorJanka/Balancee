import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDauMauRatio } from "@/app/actions/analytics/kpi";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const ADMIN_ID = process.env.ADMIN_USER_ID;

  if (!session?.user || session.user.id !== ADMIN_ID) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const data = await getDauMauRatio();

    return NextResponse.json(data);
    
  } catch (error) {
    console.error("KPI Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}