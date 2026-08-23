import { NextRequest, NextResponse } from "next/server";
import { generateAgoraRtcToken } from "@/lib/agora/agoraToken";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channelName = searchParams.get("channelName") || "sakhi-main-channel";
    const uidParam = searchParams.get("uid");
    const uid = uidParam ? (isNaN(Number(uidParam)) ? uidParam : Number(uidParam)) : 0;
    const role = (searchParams.get("role") as "publisher" | "subscriber") || "publisher";

    const tokenData = generateAgoraRtcToken(channelName, uid, role);

    return NextResponse.json(tokenData, { status: 200 });
  } catch (error: any) {
    console.error("Agora Token Generation API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate Agora token" },
      { status: 500 }
    );
  }
}
