"use client";

import React, { useEffect, useRef } from "react";
import { Mic, Bot, Sparkles, AlertTriangle, UserCheck, RefreshCw } from "lucide-react";

export interface TranscriptTurn {
  id: string;
  sender: "USER" | "AI" | "SYSTEM";
  textHindi: string;
  textEnglish: string;
  timestamp: string;
  isInterruption?: boolean;
  toolTriggered?: string;
  correctedValue?: { oldVal: string; newVal: string };
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
    <div className="craft-card rounded-3xl p-5 lg:p-6 flex flex-col h-[420px] lg:h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3.5 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100/90 border border-orange-200 flex items-center justify-center text-terracotta font-bold shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2A180D] text-base leading-tight">
              {lang === "hi" ? "लाइव वॉयस बातचीत (Voice Dialogue)" : "Live Voice Dialogue & Captions"}
            </h3>
            <p className="text-[11px] text-[#785E4B]">
              {lang === "hi" ? "रीयल-टाइम हिन्गलिश स्पीच और बातचीत" : "Real-time bilingual Hinglish transcript"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 bg-[#F5EDE1] text-[#5A3F2A] rounded-full border border-[#DFCEBA] shadow-xs">
          {transcript.length} turns
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#8D7561] p-6">
            <Mic className="w-8 h-8 text-terracotta mb-2 animate-bounce" />
            <p className="font-semibold text-sm text-[#3E2817]">
              {lang === "hi"
                ? "माइक दबाकर बातचीत शुरू करें..."
                : "Press the mic and start talking..."}
            </p>
            <p className="text-xs text-[#8A715C] mt-1 max-w-xs">
              {lang === "hi"
                ? "जैसे: 'मेरे पास 100 हैंडमेड बास्केट हैं और मुझे बेचना है।'"
                : "e.g., 'Mere paas 100 handmade baskets hain aur mujhe bechna hai.'"}
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
                  className="mx-auto my-2 px-3.5 py-1.5 bg-orange-50 border border-orange-200/80 text-orange-950 text-xs rounded-full font-semibold flex items-center gap-2 w-fit shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                  <span>{lang === "hi" ? turn.textHindi : turn.textEnglish}</span>
                </div>
              );
            }

            return (
              <div
                key={turn.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-fade-in`}
              >
                {/* Speaker Label & Timestamp */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#79624E] font-semibold">
                  {isUser ? (
                    <>
                      <span className="text-[#3F2B1B] font-bold">आप (Artisan)</span>
                      <span className="text-[#AFA091]">· {turn.timestamp}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-terracotta flex items-center gap-1 font-extrabold">
                        <Bot className="w-3.5 h-3.5" />
                        Sakhi AI
                      </span>
                      <span className="text-[#AFA091]">· {turn.timestamp}</span>
                      {turn.toolTriggered && (
                        <span className="bg-indigo-50 text-indigo-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                          {turn.toolTriggered}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-br from-terracotta to-terracotta-dark text-white rounded-tr-none font-medium shadow-orange-950/10"
                      : "bg-[#F8F3EB] text-[#25170C] rounded-tl-none border border-[#E8DCcb]"
                  }`}
                >
                  {/* Correction / Interruption Banner */}
                  {turn.isInterruption && (
                    <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Correction Recovery (Barge-in Handled)
                    </div>
                  )}

                  <p className="font-semibold text-[13px] sm:text-[14px]">
                    {lang === "hi" ? turn.textHindi : turn.textEnglish}
                  </p>

                  {/* Secondary Language Subtitle */}
                  <p
                    className={`mt-1.5 text-[11px] font-normal italic ${
                      isUser ? "text-orange-100/80" : "text-[#7B624E]"
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
