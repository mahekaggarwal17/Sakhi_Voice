"use client";

import React, { useState, useEffect } from "react";
import { BuyerProfile } from "@/lib/data/seedBuyers";
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, Sparkles, Handshake, Bot, ArrowRight } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

interface BuyerCallModalProps {
  buyer: BuyerProfile;
  quantity: number;
  product: string;
  onEndCall: () => void;
  onAgreePrice: (agreedPrice: number) => void;
  lang: "hi" | "en";
}

export const BuyerCallModal: React.FC<BuyerCallModalProps> = ({
  buyer,
  quantity,
  product,
  onEndCall,
  onAgreePrice,
  lang,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [negotiationStep, setNegotiationStep] = useState<number>(0);
  const [currentBuyerOffer, setCurrentBuyerOffer] = useState<number>(buyer.initialOfferPrice);
  const [userCounterOffer, setUserCounterOffer] = useState<number>(220);
  const [isBuyerSpeaking, setIsBuyerSpeaking] = useState<boolean>(true);
  const [callTranscript, setCallTranscript] = useState<Array<{ sender: string; text: string; role: "buyer" | "user" | "ai" }>>([
    {
      sender: buyer.name,
      text: "Namaste! Main Rajesh Sharma bol raha hoon ABC Handicrafts se. Humein handmade baskets chahiye.",
      role: "buyer",
    },
    {
      sender: buyer.name,
      text: "Market ke hisaab se main aapko ₹190 per basket offer kar sakta hoon.",
      role: "buyer",
    },
    {
      sender: "Sakhi",
      text: "Buyer ₹190 offer kar raha hai. Aapka minimum kitna rate rahega?",
      role: "ai",
    },
  ]);

  // Call timer
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

  // Step 1: Entrepreneur sends Counter Offer (e.g. ₹220 or ₹205)
  const handleSendCounterOffer = (amount: number) => {
    setIsBuyerSpeaking(true);
    const newTurns = [
      ...callTranscript,
      {
        sender: "उद्यमी (You)",
        text: `Humara maal bilkul top handmade quality hai. Hum ₹${amount} per basket se kam nahi de sakte.`,
        role: "user" as const,
      },
    ];

    if (amount <= buyer.targetMaxPrice) {
      // Buyer Accepts Deal at ₹205!
      setTimeout(() => {
        setCallTranscript([
          ...newTurns,
          {
            sender: buyer.name,
            text: "Theek hai, ₹205 per piece par deal pakki karte hain!",
            role: "buyer",
          },
          {
            sender: "Sakhi",
            text: `Buyer ne ₹${amount} par haan bol diya hai. Kya main deal confirm kar doon?`,
            role: "ai",
          },
        ]);
        setCurrentBuyerOffer(amount);
        setNegotiationStep(2);
        setIsBuyerSpeaking(false);
      }, 1200);
    } else {
      // Buyer Counter 1 (e.g. ₹205)
      setTimeout(() => {
        const revisedOffer = buyer.targetMaxPrice; // 205
        setCallTranscript([
          ...newTurns,
          {
            sender: buyer.name,
            text: `Product achha hai. Main final ₹${revisedOffer} per piece de sakta hoon.`,
            role: "buyer",
          },
          {
            sender: "Sakhi",
            text: `Buyer ₹${revisedOffer} per basket offer kar raha hai. Yeh fair rate hai. Kya aap ready hain?`,
            role: "ai",
          },
        ]);
        setCurrentBuyerOffer(revisedOffer);
        setNegotiationStep(1);
        setIsBuyerSpeaking(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl border-2 border-orange-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Call Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse">
                  Agora RTC Live Call
                </span>
                <span className="text-xs text-orange-100 font-mono">{formatTime(callDuration)}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight mt-0.5">{buyer.name}</h3>
              <p className="text-xs text-orange-100/90">{buyer.organization}</p>
            </div>
          </div>

          <button
            onClick={onEndCall}
            className="p-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-700/30 transition-all active:scale-95 flex items-center gap-1.5 text-xs"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Real-time Voice Audio Visualizer */}
        <div className="bg-[#EFE7DB] px-6 py-3 border-b border-[#E3D6C2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5A4330]">
            <Volume2 className="w-4 h-4 text-orange-600" />
            <span>{isBuyerSpeaking ? `${buyer.name} is speaking...` : "You are speaking (Agora WebRTC)"}</span>
          </div>
          <div className="w-48">
            <AudioWaveform
              isActive={true}
              isSpeaking={isBuyerSpeaking}
              isListening={!isBuyerSpeaking}
              volumeLevel={60}
            />
          </div>
        </div>

        {/* Live Conversation Transcript in Call */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white/80">
          {callTranscript.map((turn, idx) => {
            const isBuyer = turn.role === "buyer";
            const isAI = turn.role === "ai";

            if (isAI) {
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 text-orange-950 text-xs flex items-start gap-2"
                >
                  <Bot className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block mb-0.5 text-orange-800">
                      Sakhi AI Negotiation Assistant:
                    </span>
                    <span>{turn.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col ${isBuyer ? "items-start" : "items-end"}`}
              >
                <span className="text-[10px] font-semibold text-[#7A6451] mb-1 px-1">
                  {turn.sender}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                    isBuyer
                      ? "bg-[#F3ECE1] text-[#291B10] border border-[#E4D5C2] rounded-tl-none font-medium"
                      : "bg-orange-600 text-white rounded-tr-none font-medium shadow-sm"
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Offer Status & Live Action Bar */}
        <div className="bg-[#FAF5ED] p-5 border-t border-[#E8DCCB] space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#E6DAC7]">
            <div>
              <span className="text-[11px] text-[#7A624F] font-semibold block">
                Current Buyer Offer
              </span>
              <span className="text-xl font-extrabold text-emerald-800">
                ₹{currentBuyerOffer} <span className="text-xs font-normal text-emerald-700">/ basket</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#7A624F] font-semibold block">
                Total Deal Value ({quantity} units)
              </span>
              <span className="text-base font-extrabold text-orange-900">
                ₹{(currentBuyerOffer * quantity).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action Triggers based on Step */}
          {negotiationStep === 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleSendCounterOffer(220)}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                🗣️ Say: "₹220 se kam nahi denge"
              </button>
              <button
                onClick={() => handleSendCounterOffer(205)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                🗣️ Say: "₹205 final offer hai"
              </button>
            </div>
          )}

          {negotiationStep === 1 && (
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleSendCounterOffer(205)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Handshake className="w-4 h-4" />
                <span>Agree to ₹205 and Finalize</span>
              </button>
            </div>
          )}

          {negotiationStep === 2 && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Mutual Price Agreed: ₹{currentBuyerOffer}/unit
              </span>
              <button
                onClick={() => onAgreePrice(currentBuyerOffer)}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-700/25 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Handshake className="w-4 h-4" />
                <span>Confirm Deal & Record</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
