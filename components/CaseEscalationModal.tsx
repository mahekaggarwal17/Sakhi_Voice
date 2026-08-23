"use client";

import React from "react";
import { SupportCaseRecord } from "@/lib/data/seedSupport";
import { HeartHandshake, PhoneCall, CheckCircle2, X, FileText, ArrowRight, ShieldCheck } from "lucide-react";

interface CaseEscalationModalProps {
  caseRecord: SupportCaseRecord;
  onClose: () => void;
  lang: "hi" | "en";
}

export const CaseEscalationModal: React.FC<CaseEscalationModalProps> = ({
  caseRecord,
  onClose,
  lang,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[20px] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-zinc-950 w-full max-w-lg rounded-5xl border border-white/15 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Case Escalated
              </span>
              <span className="text-xs font-mono text-zinc-400 font-bold">{caseRecord.caseId}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1 tracking-tight leading-tight">
              {lang === "hi" ? "काउंसलर को केस सफलतापूर्वक भेजा गया" : "NGO Support Case Handover Assembled"}
            </h3>
          </div>
        </div>

        {/* Structured Case File #CASE-SKH HUD */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10 space-y-3 mb-6 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-zinc-400">{lang === "hi" ? "संस्था / NGO" : "Assigned NGO"}:</span>
            <span className="font-bold text-white">{caseRecord.matchedOrganization?.name || "Sakhi Foundation"}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-zinc-400">{lang === "hi" ? "काउंसलर / Counselor" : "Counselor"}:</span>
            <span className="font-bold text-emerald-400">
              {caseRecord.matchedOrganization?.representativeName || "Priya Sharma"} ({caseRecord.matchedOrganization?.contactNumber || "+91 98110 23456"})
            </span>
          </div>

          <div className="pb-2 border-b border-white/10">
            <span className="text-zinc-400 block mb-1">{lang === "hi" ? "तैयार किया गया सारांश" : "Zero-Repetition Audio Summary"}:</span>
            <p className="bg-black/40 p-3 rounded-2xl text-zinc-300 italic border border-white/10 font-normal leading-relaxed">
              "{caseRecord.conversationSummary}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-zinc-400">{lang === "hi" ? "अनुदान सहायता" : "Eligible Grant"}:</span>
            <span className="font-black text-white text-sm">{caseRecord.supportRequirement?.requestedAmount || "₹50,000"}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full btn-pill-action justify-between cursor-pointer"
        >
          <span>CLOSE & RETURN TO AGENT</span>
          <div className="icon-container">
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </div>
        </button>
      </div>
    </div>
  );
};
