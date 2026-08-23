import { NextRequest, NextResponse } from "next/server";
import { vobizClient } from "@/lib/vobiz/vobizClient";
import { processUserVoiceInput } from "@/lib/agent/agentEngine";
import { INITIAL_BUSINESS_MEMORY } from "@/lib/agent/conversationState";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let callerInput = "";
    let fromNumber = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      callerInput = body.SpeechResult || body.TranscriptionText || body.Digits || body.input || "";
      fromNumber = body.From || body.from || "Caller";
    } else {
      const formData = await req.formData();
      callerInput = (formData.get("SpeechResult") as string) || (formData.get("Digits") as string) || "";
      fromNumber = (formData.get("From") as string) || "Caller";
    }

    // If initial greeting on call connection
    if (!callerInput || callerInput.trim().length === 0) {
      const welcomeHindi = "नमस्ते! सखी वॉयस हेल्पलाइन में आपका स्वागत है। आप आज क्या बेचना या जानना चाहती हैं?";
      const welcomeEn = "Welcome to Sakhi Voice helpline. What would you like to sell or explore today?";
      const xmlResponse = vobizClient.generateInboundXML(welcomeHindi, welcomeEn);

      return new NextResponse(xmlResponse, {
        status: 200,
        headers: { "Content-Type": "application/xml" },
      });
    }

    // Process user utterance through Sakhi conversational engine
    const turnResult = processUserVoiceInput(callerInput, INITIAL_BUSINESS_MEMORY, false);
    const spokenText = turnResult.spokenTextDevanagari || turnResult.spokenTextHindi;

    const xmlResponse = vobizClient.generateInboundXML(spokenText, turnResult.spokenTextEnglish);

    return new NextResponse(xmlResponse, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error: any) {
    console.error("Vobiz Inbound Webhook Error:", error);
    const fallbackXML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Speak language="hi-IN">नमस्ते! सखी हेल्पलाइन चालू है। कृपया अपनी बात कहें।</Speak>
</Response>`;
    return new NextResponse(fallbackXML, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  }
}

export async function GET() {
  const welcomeHindi = "नमस्ते! सखी वॉयस हेल्पलाइन में आपका स्वागत है।";
  const xmlResponse = vobizClient.generateInboundXML(welcomeHindi, "Welcome to Sakhi Helpline");
  return new NextResponse(xmlResponse, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
