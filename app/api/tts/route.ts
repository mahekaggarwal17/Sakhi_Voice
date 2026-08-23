import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// High-fidelity natural Hindi TTS audio stream generator
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");
    const lang = searchParams.get("lang") || "hi";

    if (!text) {
      return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
    }

    // Clean text for audio streaming (max 200 chars per segment)
    const cleanText = encodeURIComponent(text.slice(0, 200));
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${cleanText}`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!audioRes.ok) {
      return NextResponse.json({ error: "TTS provider unavailable" }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: any) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate TTS audio" }, { status: 500 });
  }
}
