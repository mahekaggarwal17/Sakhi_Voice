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
        return <Database className="w-4 h-4 text-emerald-600" />;
      case "findBuyers":
        return <Handshake className="w-4 h-4 text-blue-600" />;
      case "startAgoraBuyerCall":
        return <PhoneCall className="w-4 h-4 text-orange-600 animate-pulse" />;
      case "createDeal":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "findSupportOptions":
      case "createSupportCase":
        return <HeartHandshake className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-purple-200 p-3.5 shadow-md shadow-purple-900/5 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
          {getToolIcon(toolResult.toolName)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              External Action: {toolResult.toolName}()
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified Execution
            </span>
          </div>
          <p className="text-xs font-semibold text-[#2C1D11] mt-0.5">
            {lang === "hi" ? toolResult.summaryHindi : toolResult.summaryEnglish}
          </p>
        </div>
      </div>
    </div>
  );
};
