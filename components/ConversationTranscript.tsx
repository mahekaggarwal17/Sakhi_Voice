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
    <div className="glass-stat-card rounded-3xl p-5 lg:p-6 flex flex-col h-[420px] lg:h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight leading-tight">
              {lang === "hi" ? "लाइव वॉयस संवाद (Voice Dialogue)" : "Live Voice Dialogue & Captions"}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {lang === "hi" ? "रीयल-टाइम हिन्गलिश स्पीच बातचीत" : "Real-time bilingual Hinglish turn transcript"}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-3 py-1 bg-white/5 text-zinc-300 rounded-full border border-white/10">
          {transcript.length} turns
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
            <Mic className="w-8 h-8 text-emerald-400 mb-2 animate-bounce" />
            <p className="font-medium text-sm text-zinc-300">
              {lang === "hi"
                ? "माइक दबाकर बातचीत शुरू करें..."
                : "Press the glass orb and start talking..."}
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
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
                  className="mx-auto my-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-full font-semibold flex items-center gap-2 w-fit"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === "hi" ? turn.textHindi : turn.textEnglish}</span>
                </div>
              );
            }

            return (
              <div
                key={turn.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-fade-in-up`}
              >
                {/* Speaker Label & Timestamp */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-zinc-400 font-semibold">
                  {isUser ? (
                    <>
                      <span className="text-zinc-200 font-bold">आप (Artisan)</span>
                      <span className="text-zinc-500">· {turn.timestamp}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-emerald-400 flex items-center gap-1 font-extrabold">
                        <Bot className="w-3.5 h-3.5" />
                        Sakhi AI
                      </span>
                      <span className="text-zinc-500">· {turn.timestamp}</span>
                      {turn.toolTriggered && (
                        <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
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
                      ? "bg-white text-zinc-950 rounded-tr-none font-medium shadow-md"
                      : "bg-white/10 text-white rounded-tl-none border border-white/15 backdrop-blur-md"
                  }`}
                >
                  {/* Correction Banner */}
                  {turn.isInterruption && (
                    <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] bg-amber-400 text-zinc-950 font-black px-2.5 py-0.5 rounded-full">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Correction Recovery (Barge-in Handled)
                    </div>
                  )}

                  <p className="font-semibold text-[13px] sm:text-[14px]">
                    {lang === "hi" ? turn.textHindi : turn.textEnglish}
                  </p>

                  <p
                    className={`mt-1.5 text-[11px] font-normal italic ${
                      isUser ? "text-zinc-600" : "text-zinc-400"
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
