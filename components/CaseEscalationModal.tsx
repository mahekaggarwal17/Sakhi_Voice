"use client";

import React, { useState, useEffect } from "react";
import { SupportCaseRecord } from "@/lib/data/seedSupport";
import { HeartHandshake, Phone, PhoneOff, CheckCircle2, ShieldCheck, FileText, UserCheck, Volume2, X } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

interface CaseEscalationModalProps {
  caseData: SupportCaseRecord;
  onClose: () => void;
  lang: "hi" | "en";
}

export const CaseEscalationModal: React.FC<CaseEscalationModalProps> = ({
  caseData,
  onClose,
  lang,
}) => {
  const [callActive, setCallActive] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [counselorSpeaking, setCounselorSpeaking] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl border-3 border-indigoCraft/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigoCraft-700 via-indigoCraft to-indigoCraft-900 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <HeartHandshake className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                  Agora Live Counselor Call
                </span>
                <span className="text-xs font-mono text-indigo-100 font-bold">{formatTime(callDuration)}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight mt-0.5">
                {caseData.matchedOrganization.representativeName}
              </h3>
              <p className="text-xs text-indigo-100/90 font-medium">
                {caseData.matchedOrganization.name} · {caseData.matchedOrganization.representativeRole}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition-all active:scale-95 flex items-center gap-1.5 text-xs shadow-md border border-rose-600 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Audio Waveform Bar */}
        <div className="bg-[#EFE5D6] px-6 py-2.5 border-b border-[#E0D1BC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#553C28]">
            <Volume2 className="w-4 h-4 text-indigoCraft" />
            <span>
              {counselorSpeaking
                ? `${caseData.matchedOrganization.representativeName} (Counselor) is speaking...`
                : "You are speaking (Agora Voice Live)"}
            </span>
          </div>
          <div className="w-48">
            <AudioWaveform
              isActive={callActive}
              isSpeaking={counselorSpeaking}
              isListening={!counselorSpeaking}
              volumeLevel={65}
            />
          </div>
        </div>

        {/* Counselor Live Spoken Message */}
        <div className="p-4 bg-indigoCraft-50/70 border-b border-indigoCraft-100">
          <div className="flex items-start gap-2.5">
            <UserCheck className="w-5 h-5 text-indigoCraft mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-extrabold text-indigoCraft-900 block mb-0.5">
                {caseData.matchedOrganization.representativeName} (Counselor):
              </span>
              <p className="text-xs sm:text-sm text-indigoCraft-950 italic font-semibold leading-relaxed">
                "Namaste! Mujhe Sakhi se aapki saari details mil gayi hain. Aapki baskets ki deal finalize ho chuki hai, aur aapko business expand karne ke liye ₹50,000 ka support chahiye. Aapko dobara batane ki zaroorat nahi hai, main seedha aapka support process karti hoon."
              </p>
            </div>
          </div>
        </div>

        {/* Structured Case Handoff File View */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFFDF9]/90">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#EFE5D6]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigoCraft" />
              <h4 className="font-bold text-[#2A180D] text-sm">
                {lang === "hi" ? "संरचित केस फ़ाइल (Structured Handoff Case File)" : "Preserved Handoff Context"}
              </h4>
            </div>
            <span className="font-mono text-xs font-extrabold text-indigoCraft-900 bg-indigoCraft-100 px-3 py-1 rounded-lg border border-indigoCraft-200 shadow-xs">
              {caseData.caseId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#ECE0CF] shadow-xs">
              <span className="text-[11px] text-[#785E4B] font-semibold block mb-0.5">
                Entrepreneur Profile
              </span>
              <p className="font-bold text-[#2A180D] text-sm">
                {caseData.entrepreneurProfile.product} ({caseData.entrepreneurProfile.currentProduction})
              </p>
              <p className="text-[11px] text-[#69503B] font-medium">{caseData.entrepreneurProfile.location}</p>
            </div>

            <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#ECE0CF] shadow-xs">
              <span className="text-[11px] text-[#785E4B] font-semibold block mb-0.5">
                Support Requirement
              </span>
              <p className="font-extrabold text-terracotta text-sm">
                {caseData.supportRequirement.requestedAmount}
              </p>
              <p className="text-[11px] text-[#69503B] font-medium">{caseData.supportRequirement.purpose}</p>
            </div>
          </div>

          {/* Conversation Summary Preserved */}
          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EADBCA] text-xs space-y-1.5 shadow-xs">
            <span className="font-bold text-[#2A180D] block">
              Auto-Generated Voice Conversation Summary:
            </span>
            <p className="text-[#553C28] leading-relaxed italic font-medium">
              "{caseData.conversationSummary}"
            </p>
          </div>

          {/* Verified Questions Answered */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#6D4C33] uppercase tracking-wider block">
              Pre-Verified Details Handed Over (Zero Repetition):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {caseData.verifiedDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-emerald-950 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span className="font-semibold">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4EB] p-4 border-t border-[#E8DCcb] flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Full context preserved · Zero repetition
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-indigoCraft to-indigoCraft-900 hover:from-indigoCraft-800 hover:to-black text-white font-bold text-xs rounded-xl shadow-tactile transition-all btn-craft cursor-pointer"
          >
            Close & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
