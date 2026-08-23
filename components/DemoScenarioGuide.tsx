"use client";

import React from "react";
import { Sparkles, CheckCircle2, Play, ArrowRight, X, ShieldAlert, Radio } from "lucide-react";

interface DemoScenarioGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onRunStep: (stepNumber: number) => void;
  currentStep: number;
}

export const DemoScenarioGuide: React.FC<DemoScenarioGuideProps> = ({
  isOpen,
  onClose,
  onRunStep,
  currentStep,
}) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: "Step 1 — Entrepreneur Starts Speaking",
      voiceUtterance: "Mere paas 100 handmade baskets hain aur mujhe bechna hai.",
      description: "Sakhi greets the user in Hinglish, extracts product & quantity, and dynamically asks for material/type.",
      tag: "Natural Language & Hinglish",
    },
    {
      step: 2,
      title: "Step 2 — Dynamic Conversation & Interruption (Barge-in)",
      voiceUtterance: "Ruko, quantity actually 120 hai.",
      description: "User interrupts Sakhi mid-sentence. Sakhi instantly halts speech, recovers from correction, and updates state to 120 units.",
      tag: "Barge-in & State Recovery",
    },
    {
      step: 3,
      title: "Step 3 — Market Price Intelligence",
      voiceUtterance: "Market mein iska kya rate chal raha hai?",
      description: "Sakhi calls getMarketPrice() tool. UI displays verified ₹180-₹230 market range from NHDP with AI recommendation disclaimer.",
      tag: "Verified External Tool",
    },
    {
      step: 4,
      title: "Step 4 — Buyer Discovery",
      voiceUtterance: "Buyer dhoondo.",
      description: "Sakhi searches the buyer database with findBuyers(). UI presents matching commercial buyers (Top Match: Rajesh Sharma).",
      tag: "Buyer Matching Tool",
    },
    {
      step: 5,
      title: "Step 5 — Real-time Agora Voice Call",
      voiceUtterance: "Is buyer se baat karwao.",
      description: "Launches real-time Agora RTC voice channel between entrepreneur and Rajesh Sharma (ABC Handicrafts).",
      tag: "Agora Live WebRTC Call",
    },
    {
      step: 6,
      title: "Step 6 — Live Negotiation Counter-Offer",
      voiceUtterance: "Buyer offers ₹190. Entrepreneur counters with ₹205. Buyer accepts.",
      description: "Live negotiation flow inside Agora call. AI negotiation assistant guides fair price discovery and locks in mutual agreement.",
      tag: "AI Negotiation Assist",
    },
    {
      step: 7,
      title: "Step 7 — Explicit Human Confirmation & External Deal Recording",
      voiceUtterance: "Haan, deal confirm karke record kar do.",
      description: "Safety check prevents unauthorized execution. User explicitly confirms, recording Deal #DEAL-8291 in database.",
      tag: "Human-in-the-Loop Safety",
    },
    {
      step: 8,
      title: "Step 8 — NGO Business Support Discovery",
      voiceUtterance: "Mujhe production badhane ke liye financial support aur loan chahiye.",
      description: "Sakhi retains past conversation context while discovering Sakhi Rural Enterprise Foundation micro-grant scheme.",
      tag: "Contextual Cross-Domain",
    },
    {
      step: 9,
      title: "Step 9 — Human Escalation & Context Preservation Handoff",
      voiceUtterance: "Counselor se connect karo.",
      description: "Creates structured Case #CASE-SKH with full conversation transcript so counselor takes over with zero repetition.",
      tag: "Zero-Repetition Escalation",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-lg h-full shadow-2xl border-l-2 border-[#E7D9C4] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">9-Step Winning Hackathon Demo Script</h3>
              <p className="text-xs text-orange-100">Click any step to simulate the live journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {demoSteps.map((s) => {
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-white border-orange-400 ring-2 ring-orange-300 shadow-md"
                    : "bg-[#FBF8F3] border-[#E8DCCB] hover:border-orange-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200">
                    {s.tag}
                  </span>
                  <button
                    onClick={() => onRunStep(s.step)}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </button>
                </div>

                <h4 className="font-bold text-sm text-[#27180C] mt-1">{s.title}</h4>
                <p className="text-xs font-semibold text-orange-900 italic my-1">
                  "{s.voiceUtterance}"
                </p>
                <p className="text-[11px] text-[#715945] leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2E8DC] border-t border-[#E1D1BD] flex items-center justify-between text-xs text-[#5E4734]">
          <span className="font-medium flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            Agora Conversational AI Core
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 text-white font-bold rounded-xl shadow-sm hover:bg-orange-700 transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
