"use client";

import React, { useEffect, useRef } from "react";
import { Mic, Bot, Sparkles, AlertTriangle, ArrowDown } from "lucide-react";

export interface TranscriptTurn {
  id: string;
  sender: "USER" | "AI" | "SYSTEM";
  textHindi: string;
  textEnglish: string;
  timestamp: string;
  isInterruption?: boolean;
  toolTriggered?: string;
}

interface ConversationTranscriptProps {
  transcript: TranscriptTurn[];
  lang: "hi" | "en";
}

export const ConversationTranscript: React.FC<ConversationTranscriptProps> = ({
  transcript,
  lang,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="bg-white rounded-3xl border-2 border-[#E7D9C4] p-5 lg:p-6 shadow-md shadow-orange-950/5 flex flex-col h-[400px] lg:h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2C1D11] text-base">
              {lang === "hi" ? "लाइव वॉयस संवाद (Transcript)" : "Live Voice Dialogue & Captions"}
            </h3>
            <p className="text-[11px] text-[#7C634F]">
              {lang === "hi" ? "रीयल-टाइम स्पीच-टू-टेक्स्ट और बहुभाषी बातचीत" : "Real-time bilingual Hinglish turn transcript"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 bg-[#F5EDE1] text-[#634C38] rounded-full border border-[#E3D4C0]">
          {transcript.length} turns
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3.5">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#8D7561] p-6">
            <Mic className="w-8 h-8 text-orange-400 mb-2 animate-bounce" />
            <p className="font-medium text-sm">
              {lang === "hi"
                ? "माइक दबाकर बातचीत शुरू करें..."
                : "Press the mic and start talking..."}
            </p>
            <p className="text-xs text-[#A8917D] mt-1 max-w-xs">
              {lang === "hi"
                ? "उदाहरण: 'मेरे पास 100 हैंडमेड बास्केट हैं और मुझे बेचना है।'"
                : "Example: 'I have 100 handmade baskets and I want to sell them.'"}
            </p>
          </div>
        ) : (
          transcript.map((turn) => {
            const isUser = turn.sender === "USER";
            const isSystem = turn.sender === "SYSTEM";

            if (isSystem) {
              return (
                <div
                  key={turn.id}
                  className="mx-auto my-2 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-900 text-xs rounded-full font-medium flex items-center gap-1.5 w-fit"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>{lang === "hi" ? turn.textHindi : turn.textEnglish}</span>
                </div>
              );
            }

            return (
              <div
                key={turn.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Speaker Label & Timestamp */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#7B6450] font-semibold">
                  {isUser ? (
                    <>
                      <span>उद्यमी (You)</span>
                      <span className="text-[#B39F8D]">· {turn.timestamp}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-orange-700 flex items-center gap-1 font-bold">
                        <Bot className="w-3 h-3" />
                        Sakhi AI
                      </span>
                      <span className="text-[#B39F8D]">· {turn.timestamp}</span>
                      {turn.toolTriggered && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-purple-200">
                          ⚡ {turn.toolTriggered}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-br from-[#E25C07] to-[#C44A00] text-white rounded-tr-none font-medium"
                      : "bg-[#F7F2E9] text-[#291B10] rounded-tl-none border border-[#E4D5C2]"
                  }`}
                >
                  {/* Interruption Badge */}
                  {turn.isInterruption && (
                    <div className="mb-1.5 inline-flex items-center gap-1 text-[10px] bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      Interrupted & Corrected
                    </div>
                  )}

                  <p className="font-semibold text-[13px] sm:text-sm">
                    {lang === "hi" ? turn.textHindi : turn.textEnglish}
                  </p>

                  {/* Secondary Language Sub-caption */}
                  <p
                    className={`mt-1 text-[11px] font-normal italic ${
                      isUser ? "text-orange-100/80" : "text-[#7B6450]"
                    }`}
                  >
                    {lang === "hi" ? turn.textEnglish : turn.textHindi}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
