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
        return <Database className="w-4 h-4 text-emerald-700" />;
      case "findBuyers":
        return <Handshake className="w-4 h-4 text-indigoCraft" />;
      case "startAgoraBuyerCall":
        return <PhoneCall className="w-4 h-4 text-terracotta animate-pulse" />;
      case "createDeal":
        return <CheckCircle className="w-4 h-4 text-emerald-700" />;
      case "findSupportOptions":
      case "createSupportCase":
        return <HeartHandshake className="w-4 h-4 text-indigoCraft" />;
      default:
        return <Sparkles className="w-4 h-4 text-terracotta" />;
    }
  };

  return (
    <div className="w-full bg-[#FFFDF9] rounded-2xl border-2 border-indigoCraft-200 p-3.5 shadow-card flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigoCraft-50 border border-indigoCraft-200 flex items-center justify-center flex-shrink-0 shadow-xs">
          {getToolIcon(toolResult.toolName)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigoCraft-100 text-indigoCraft-900 border border-indigoCraft-200">
              External Action: {toolResult.toolName}()
            </span>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Verified Execution
            </span>
          </div>
          <p className="text-xs font-bold text-[#2A180D] mt-0.5 leading-relaxed">
            {lang === "hi" ? toolResult.summaryHindi : toolResult.summaryEnglish}
          </p>
        </div>
      </div>
    </div>
  );
};
