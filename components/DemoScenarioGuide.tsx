"use client";

import React from "react";
import { Sparkles, Play, X, Radio, ArrowRight, CheckCircle2 } from "lucide-react";

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
      title: "स्टेप 1 — उत्पाद पहचान (Product Discovery)",
      voiceUtterance: "मेरे पास 100 हस्तनिर्मित टोकरियाँ हैं और मुझे बेचना है।",
      description: "सखी जवाब देती है: 'अच्छा, 100 बास्केट्स। आप इन्हें थोक में बेचना चाहती हैं या लोकल मार्केट में?'",
      tag: "Natural Hinglish Dialogue",
    },
    {
      step: 2,
      title: "स्टेप 2 — स्थान और थोक उद्देश्य (Location & Bulk Intent)",
      voiceUtterance: "थोक में। ग्रेटर नोएडा।",
      description: "सखी याद रखती है: 'ठीक है। ग्रेटर नोएडा से 100 बास्केट्स। पहले मार्केट रेट चेक करूँ?'",
      tag: "Adaptive Memory Slot Filling",
    },
    {
      step: 3,
      title: "स्टेप 3 — मंडी भाव जाँच (Market Price Intelligence)",
      voiceUtterance: "हाँ, मंडी भाव चेक करो।",
      description: "सखी रेट टूल चलाती है: 'ग्रेटर नोएडा में बास्केट्स का होलसेल रेट ₹180 से ₹230 चल रहा है। आपको ₹220 से बात शुरू करनी चाहिए।'",
      tag: "Live Mandi Rate Tool",
    },
    {
      step: 4,
      title: "स्टेप 4 — खरीदार खोज (Buyer Discovery)",
      voiceUtterance: "ठीक है, खरीदार दिखाओ।",
      description: "सखी 100 बास्केट्स के लिए सत्यापित थोक खरीदार राजेश शर्मा (ABC हैंडीक्राफ्ट्स) खोजती है।",
      tag: "Verified Buyer Matching",
    },
    {
      step: 5,
      title: "स्टेप 5 — सुधार और बदलाव (Barge-in / Correction)",
      voiceUtterance: "असल में मेरे पास 150 टोकरियाँ हैं।",
      description: "सखी बिना रीसेट किए तुरंत मात्रा 150 अपडेट करती है: 'अच्छा, 150 हैं। गॉट इट। मैं अपडेटेड क्वांटिटी से चेक करती हूँ।'",
      tag: "Interruption & State Recovery",
    },
    {
      step: 6,
      title: "स्टेप 6 — लाइव Agora वॉयस कॉल (Live Voice Negotiation)",
      voiceUtterance: "राजेश शर्मा से सीधी बात करवाओ।",
      description: "Agora RTC 1-on-1 वॉयस चैनल कनेक्ट होता है। AI मार्गदर्शन करता है और बायर ₹205/यूनिट पर सहमत होता है।",
      tag: "Agora Live WebRTC Call",
    },
    {
      step: 7,
      title: "स्टेप 7 — डील पुष्टि सुरक्षा गेट (Commercial Deal Confirmation)",
      voiceUtterance: "हाँ, डील पक्की कर दो।",
      description: "कमर्शियल सेफ्टी गेट उद्यमी की स्पष्ट मंजूरी लेता है और ₹30,750 की डील डेटाबेस में सेव करता है।",
      tag: "Safety Guard & DB Record",
    },
    {
      step: 8,
      title: "स्टेप 8 — बिजनेस लोन व अनुदान (Financial Grant & Loans)",
      voiceUtterance: "मुझे बिजनेस के लिए लोन सहायता चाहिए।",
      description: "सखी पुरानी बातचीत याद रखते हुए सेवा भारत और मुद्रा योजना के ₹50,000 अनुदान विकल्प खोजती है।",
      tag: "Cross-Domain Context Preservation",
    },
    {
      step: 9,
      title: "स्टेप 9 — मानव काउंसलर हैंडओवर (Human Officer Escalation)",
      voiceUtterance: "अधिकारी से बात करवा दो।",
      description: "सखी पूरा संरचित सारांश तैयार करती है ताकि उद्यमी को अधिकारी के सामने दोबारा कुछ न दोहराना पड़े।",
      tag: "Zero-Repetition Context Handover",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-[#FFF8F0] w-full max-w-lg h-full shadow-2xl border-l-2 border-[#F2E4D4] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E85D3A] via-[#F4C430] to-[#E85D3A] p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-100 animate-pulse" />
            <div className="text-left">
              <h3 className="font-extrabold text-base tracking-tight">9-स्टेप जज डेमो गाइड (Live Demo Guide)</h3>
              <p className="text-xs text-orange-100 font-medium">किसी भी स्टेप पर 'चलाएं (Run)' क्लिक करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left">
          {demoSteps.map((s) => {
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? "bg-white border-[#E85D3A] ring-2 ring-[#E85D3A]/20 shadow-md"
                    : "bg-white/80 border-[#F2E4D4] hover:border-[#E85D3A]/50 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase bg-[#E85D3A]/10 text-[#E85D3A] px-2.5 py-0.5 rounded-full border border-[#E85D3A]/20 shadow-xs">
                    {s.tag}
                  </span>
                  <button
                    onClick={() => {
                      onRunStep(s.step);
                    }}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#E85D3A] hover:bg-[#C94726] px-3.5 py-1.5 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>चलाएं (Run)</span>
                  </button>
                </div>

                <h4 className="font-extrabold text-sm text-[#2D1F1B] mt-1">{s.title}</h4>
                <p className="text-xs font-bold text-[#E85D3A] italic my-1">
                  "{s.voiceUtterance}"
                </p>
                <p className="text-[11px] text-[#8C7B70] font-medium leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#F2E4D4] flex items-center justify-between text-xs text-[#8C7B70]">
          <span className="font-bold flex items-center gap-1.5 text-[#2B7A78]">
            <Radio className="w-3.5 h-3.5 text-[#E85D3A] animate-pulse" />
            Agora Conversational AI Core
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2D1F1B] hover:bg-black text-white font-bold rounded-full shadow-sm transition-all cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
