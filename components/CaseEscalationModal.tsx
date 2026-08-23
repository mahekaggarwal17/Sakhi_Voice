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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border-2 border-purple-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <HeartHandshake className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  Agora Live Counselor Call
                </span>
                <span className="text-xs font-mono text-purple-200">{formatTime(callDuration)}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight mt-0.5">
                {caseData.matchedOrganization.representativeName}
              </h3>
              <p className="text-xs text-purple-200">
                {caseData.matchedOrganization.name} · {caseData.matchedOrganization.representativeRole}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all active:scale-95 flex items-center gap-1.5 text-xs shadow-lg"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Audio Waveform Bar */}
        <div className="bg-[#EFE8DF] px-6 py-2.5 border-b border-[#E3D6C2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#483321]">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <span>
              {counselorSpeaking
                ? `${caseData.matchedOrganization.representativeName} is speaking...`
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
        <div className="p-4 bg-purple-50/80 border-b border-purple-200">
          <div className="flex items-start gap-2.5">
            <UserCheck className="w-5 h-5 text-purple-700 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-purple-900 block mb-0.5">
                {caseData.matchedOrganization.representativeName} (Counselor):
              </span>
              <p className="text-xs sm:text-sm text-purple-950 italic font-medium leading-relaxed">
                "Namaste behenji! Mujhe Sakhi AI se aapka poora case context aur conversation summary mil gayi hai. Aapke 120 handmade baskets ki deal finalize ho gayi hai, aur aapko expansion ke liye ₹50,000 ki sahayata chahiye. Aapko dobara details batane ki zaroorat nahi hai, main aapka grant form direct approve kar rahi hoon."
              </p>
            </div>
          </div>
        </div>

        {/* Structured Case Handoff File View */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/90">
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE5D6]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-700" />
              <h4 className="font-bold text-[#2A1B10] text-sm">
                {lang === "hi" ? "संरचित केस फ़ाइल (Structured Handoff Case)" : "Preserved Handoff Context"}
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200">
              {caseData.caseId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#ECE0CF]">
              <span className="text-[11px] text-[#7A614D] font-semibold block mb-0.5">
                Entrepreneur Profile
              </span>
              <p className="font-bold text-[#26170D]">
                {caseData.entrepreneurProfile.product} ({caseData.entrepreneurProfile.currentProduction})
              </p>
              <p className="text-[11px] text-[#695442]">{caseData.entrepreneurProfile.location}</p>
            </div>

            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#ECE0CF]">
              <span className="text-[11px] text-[#7A614D] font-semibold block mb-0.5">
                Support Requirement
              </span>
              <p className="font-bold text-purple-900 text-sm">
                {caseData.supportRequirement.requestedAmount}
              </p>
              <p className="text-[11px] text-[#695442]">{caseData.supportRequirement.purpose}</p>
            </div>
          </div>

          {/* Conversation Summary Preserved */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADBCA] text-xs space-y-1.5">
            <span className="font-bold text-[#27180D] block">
              Auto-Generated Voice Conversation Summary:
            </span>
            <p className="text-[#554232] leading-relaxed italic">
              "{caseData.conversationSummary}"
            </p>
          </div>

          {/* Verified Questions Answered */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#6D5440] uppercase tracking-wider block">
              Pre-Verified Questions Handed Over:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {caseData.verifiedDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4EC] p-4 border-t border-[#E8DCcb] flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Context preserved · Zero repetition required
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            Close & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
