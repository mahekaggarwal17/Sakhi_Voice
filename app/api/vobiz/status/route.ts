import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log("[Vobiz Status Webhook]", body);

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ received: true });
  }
}
