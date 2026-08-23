"use client";

import React from "react";
import { Sparkles, CheckCircle, AlertCircle, Database, PhoneCall, Handshake, HeartHandshake } from "lucide-react";
import { ToolExecutionResult } from "@/lib/agent/tools";

interface ToolExecutionBadgeProps {
  toolResult: ToolExecutionResult | null;
  lang: "hi" | "en";
}

export const ToolExecutionBadge: React.FC<ToolExecutionBadgeProps> = ({ toolResult, lang }) => {
  if (!toolResult) return null;

  const isSuccess = toolResult.status === "SUCCESS";

  const getToolIcon = (name: string) => {
    switch (name) {
      case "getMarketPrice":
        return <Database className="w-4 h-4 text-emerald-400" />;
      case "findBuyers":
        return <Handshake className="w-4 h-4 text-emerald-400" />;
      case "startAgoraBuyerCall":
        return <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />;
      case "createDeal":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "findSupportOptions":
      case "createSupportCase":
        return <HeartHandshake className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full bg-zinc-900/90 rounded-2xl border border-white/15 p-4 shadow-glass backdrop-blur-xl flex items-center justify-between gap-3 animate-fade-in-up text-white">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
          {getToolIcon(toolResult.toolName)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Action: {toolResult.toolName}()
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
          <p className="text-xs font-semibold text-zinc-200 mt-1 leading-relaxed">
            {lang === "hi" ? toolResult.summaryHindi : toolResult.summaryEnglish}
          </p>
        </div>
      </div>
    </div>
  );
};
