"use client";

import React, { useState, useEffect } from "react";
import { BuyerProfile } from "@/lib/data/seedBuyers";
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, Sparkles, Handshake, Bot, ArrowRight, UserCheck } from "lucide-react";
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
  const [negotiationStep, setNegotiationStep] = useState<number>(0);
  const [currentBuyerOffer, setCurrentBuyerOffer] = useState<number>(buyer.initialOfferPrice);
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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl border-2 border-terracotta/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Call Header */}
        <div className="bg-gradient-to-r from-terracotta via-terracotta-dark to-[#78200A] p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse shadow-xs">
                  Agora RTC Live Call
                </span>
                <span className="text-xs text-orange-100 font-mono font-bold">{formatTime(callDuration)}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight mt-0.5">{buyer.name}</h3>
              <p className="text-xs text-orange-100/90 font-medium">{buyer.organization}</p>
            </div>
          </div>

          <button
            onClick={onEndCall}
            className="p-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-md shadow-rose-900/30 transition-all active:scale-95 flex items-center gap-1.5 text-xs cursor-pointer border border-rose-600"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Real-time Voice Audio Visualizer */}
        <div className="bg-[#EFE5D6] px-6 py-2.5 border-b border-[#E0D1BC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#553C28]">
            <Volume2 className="w-4 h-4 text-terracotta" />
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
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FFFDF9]/90">
          {callTranscript.map((turn, idx) => {
            const isBuyer = turn.role === "buyer";
            const isAI = turn.role === "ai";

            if (isAI) {
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200/90 text-orange-950 text-xs flex items-start gap-2.5 shadow-xs"
                >
                  <Bot className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-extrabold block mb-0.5 text-terracotta">
                      Sakhi AI Live Assist:
                    </span>
                    <span className="font-semibold leading-relaxed">{turn.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col ${isBuyer ? "items-start" : "items-end"}`}
              >
                <span className="text-[10px] font-bold text-[#755D4A] mb-1 px-1">
                  {turn.sender}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isBuyer
                      ? "bg-[#F4EDE2] text-[#281A0E] border border-[#E4D5C2] rounded-tl-none font-medium"
                      : "bg-terracotta text-white rounded-tr-none font-medium shadow-xs"
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Negotiation Action Bar */}
        <div className="bg-[#FAF4EB] p-5 border-t border-[#E8DCCB] space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#E6DAC7] shadow-xs">
            <div>
              <span className="text-[11px] text-[#7A604C] font-semibold block">
                Current Buyer Offer
              </span>
              <span className="text-xl font-extrabold text-emerald-900">
                ₹{currentBuyerOffer} <span className="text-xs font-semibold text-emerald-700">/ basket</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#7A604C] font-semibold block">
                Total Deal Value ({quantity} units)
              </span>
              <span className="text-base font-extrabold text-terracotta">
                ₹{(currentBuyerOffer * quantity).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action Triggers based on Step */}
          {negotiationStep === 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleSendCounterOffer(220)}
                className="px-4 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold rounded-xl shadow-tactile transition-all btn-craft cursor-pointer"
              >
                🗣️ Say: "₹220 se kam nahi denge"
              </button>
              <button
                onClick={() => handleSendCounterOffer(205)}
                className="px-4 py-2.5 bg-marigold hover:bg-marigold-600 text-white text-xs font-bold rounded-xl shadow-tactile transition-all btn-craft cursor-pointer"
              >
                🗣️ Say: "₹205 final offer hai"
              </button>
            </div>
          )}

          {negotiationStep === 1 && (
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleSendCounterOffer(205)}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-tactile transition-all flex items-center gap-2 btn-craft cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Agree to ₹205 and Finalize</span>
              </button>
            </div>
          )}

          {negotiationStep === 2 && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Mutual Price Agreed: ₹{currentBuyerOffer}/unit
              </span>
              <button
                onClick={() => onAgreePrice(currentBuyerOffer)}
                className="px-5 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-tactile flex items-center gap-2 btn-craft cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Confirm Deal & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
