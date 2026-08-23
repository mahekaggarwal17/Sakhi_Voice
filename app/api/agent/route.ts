import { NextRequest, NextResponse } from "next/server";
import { processUserVoiceInput } from "@/lib/agent/agentEngine";
import { INITIAL_BUSINESS_MEMORY } from "@/lib/agent/conversationState";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, memory, isInterruption } = body;

    const currentMemory = memory || INITIAL_BUSINESS_MEMORY;
    const response = processUserVoiceInput(transcript || "", currentMemory, isInterruption || false);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Agent Engine API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process conversational turn" },
      { status: 500 }
    );
  }
}
