import { NextRequest, NextResponse } from "next/server";
import { vobizClient } from "@/lib/vobiz/vobizClient";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, from, callerName, purpose, message } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Recipient phone number ('to') is required" },
        { status: 400 }
      );
    }

    const result = await vobizClient.makeOutboundCall({
      to,
      from,
      callerName,
      purpose,
      message,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Vobiz Outbound API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate Vobiz phone call" },
      { status: 500 }
    );
  }
}
