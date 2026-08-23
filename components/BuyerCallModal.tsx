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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[20px] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-zinc-950 w-full max-w-2xl rounded-5xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        {/* Call Header */}
        <div className="bg-zinc-900/90 p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Agora RTC Live Call
                </span>
                <span className="text-xs text-zinc-400 font-mono">{formatTime(callDuration)}</span>
              </div>
              <h3 className="font-bold text-lg text-white mt-0.5 tracking-tight">{buyer.name}</h3>
              <p className="text-xs text-zinc-400">{buyer.organization}</p>
            </div>
          </div>

          <button
            onClick={onEndCall}
            className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all active:scale-95 flex items-center gap-1.5 text-xs cursor-pointer shadow-lg"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Real-time Voice Audio Visualizer Bar */}
        <div className="bg-zinc-900/50 px-6 py-3 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <Volume2 className="w-4 h-4 text-emerald-400" />
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
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-zinc-950/80">
          {callTranscript.map((turn, idx) => {
            const isBuyer = turn.role === "buyer";
            const isAI = turn.role === "ai";

            if (isAI) {
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs flex items-start gap-2.5"
                >
                  <Bot className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-extrabold block mb-0.5 text-emerald-400 uppercase tracking-wider text-[10px]">
                      Sakhi AI Live Assist:
                    </span>
                    <span className="font-medium leading-relaxed">{turn.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col ${isBuyer ? "items-start" : "items-end"}`}
              >
                <span className="text-[10px] font-bold text-zinc-500 mb-1 px-1">
                  {turn.sender}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isBuyer
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-none font-medium"
                      : "bg-white text-zinc-950 rounded-tr-none font-medium shadow-md"
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Negotiation Action Bar */}
        <div className="bg-zinc-900/90 p-5 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                Current Buyer Offer
              </span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                ₹{currentBuyerOffer} <span className="text-xs font-normal text-zinc-400">/ basket</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                Total Deal Value ({quantity} units)
              </span>
              <span className="text-xl font-extrabold text-white">
                ₹{(currentBuyerOffer * quantity).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action Triggers based on Step */}
          {negotiationStep === 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleSendCounterOffer(220)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full border border-white/20 transition-all active:scale-95 cursor-pointer"
              >
                🗣️ Say: "₹220 se kam nahi denge"
              </button>
              <button
                onClick={() => handleSendCounterOffer(205)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-full transition-all active:scale-95 cursor-pointer shadow-emerald-glow"
              >
                🗣️ Say: "₹205 final offer hai"
              </button>
            </div>
          )}

          {negotiationStep === 1 && (
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleSendCounterOffer(205)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-full shadow-emerald-glow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Agree to ₹205 and Finalize</span>
              </button>
            </div>
          )}

          {negotiationStep === 2 && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Price Agreed: ₹{currentBuyerOffer}/unit
              </span>
              <button
                onClick={() => onAgreePrice(currentBuyerOffer)}
                className="btn-pill-action cursor-pointer"
              >
                <span>Confirm Deal & Record</span>
                <div className="icon-container">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
