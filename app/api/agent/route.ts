import { NextRequest, NextResponse } from "next/server";
import { processUserVoiceInput } from "@/lib/agent/agentEngine";
import { INITIAL_BUSINESS_MEMORY } from "@/lib/agent/conversationState";
import { SEED_BUYERS } from "@/lib/data/seedBuyers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Support all parameter naming conventions
    const userUtterance = body.userUtterance || body.transcript || body.input || body.text || "";
    const memory = body.currentMemory || body.memory || INITIAL_BUSINESS_MEMORY;
    const isInterruption = Boolean(body.isInterruption);

    console.log("Processing user utterance:", userUtterance);

    const turnResult = processUserVoiceInput(userUtterance, memory, isInterruption);

    // Format response matching frontend state
    const responsePayload = {
      responseHinglish: turnResult.spokenTextHindi,
      responseHindiDevanagari: turnResult.spokenTextDevanagari || turnResult.spokenTextHindi,
      responseEnglish: turnResult.spokenTextEnglish,
      updatedMemory: turnResult.updatedMemory,
      toolExecution: turnResult.executedTool,
      conversationPhase: turnResult.conversationPhase,
      triggerBuyerCall: turnResult.actionTrigger === "START_BUYER_CALL",
      selectedBuyer: turnResult.executedTool?.toolName === "findBuyers" && Array.isArray(turnResult.executedTool.data)
        ? turnResult.executedTool.data[0]
        : SEED_BUYERS[0],
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error("Agent Engine API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process conversational turn" },
      { status: 500 }
    );
  }
}
