"use client";

import React from "react";
import { ShieldCheck, AlertCircle, Handshake, CheckCircle2, X, Lock, ArrowRight } from "lucide-react";

interface DealConfirmModalProps {
  buyerName: string;
  organization: string;
  product: string;
  quantity: number;
  agreedPrice: number;
  onConfirm: () => void;
  onNegotiateMore: () => void;
  onCancel: () => void;
  lang: "hi" | "en";
}

export const DealConfirmModal: React.FC<DealConfirmModalProps> = ({
  buyerName,
  organization,
  product,
  quantity,
  agreedPrice,
  onConfirm,
  onNegotiateMore,
  onCancel,
  lang,
}) => {
  const totalValue = quantity * agreedPrice;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[20px] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-zinc-950 w-full max-w-lg rounded-5xl border border-white/15 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-white">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Safety Gate Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-emerald-400 block mb-0.5">
              Human-in-the-Loop Safety Gate
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
              {lang === "hi" ? "सौदा पक्का करने की पुष्टि (Confirm Deal)" : "Commercial Deal Authorization"}
            </h3>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          {lang === "hi"
            ? "सखी आपके स्पष्ट आदेश के बिना डेटाबेस में कोई भी स्थायी सौदा दर्ज नहीं करती है।"
            : "Sakhi Voice requires your explicit authorization before committing binding deal records to the database."}
        </p>

        {/* Deal Summary Ticket */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10 space-y-3 mb-6">
          <div className="flex justify-between items-center text-xs pb-2.5 border-b border-white/10">
            <span className="text-zinc-400 font-medium">{lang === "hi" ? "खरीदार / Buyer" : "Buyer"}:</span>
            <span className="font-bold text-white">{buyerName} ({organization})</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2.5 border-b border-white/10">
            <span className="text-zinc-400 font-medium">{lang === "hi" ? "उत्पाद एवं मात्रा" : "Product & Quantity"}:</span>
            <span className="font-bold text-white">{quantity} {product}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2.5 border-b border-white/10">
            <span className="text-zinc-400 font-medium">{lang === "hi" ? "तय किया गया मूल्य" : "Agreed Price"}:</span>
            <span className="font-black text-emerald-400 text-sm">₹{agreedPrice} / unit</span>
          </div>
          <div className="flex justify-between items-center pt-1.5">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{lang === "hi" ? "कुल सौदा राशि" : "Total Value"}:</span>
            <span className="text-2xl font-black text-white tracking-tight">
              ₹{totalValue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full btn-pill-action justify-between cursor-pointer"
          >
            <span>CONFIRM DEAL & RECORD IN DATABASE</span>
            <div className="icon-container">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={onNegotiateMore}
              className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-full border border-white/10 transition-all cursor-pointer"
            >
              {lang === "hi" ? "और मोलभाव करें" : "Negotiate Further"}
            </button>
            <button
              onClick={onCancel}
              className="py-3 px-4 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-semibold text-xs rounded-full border border-white/10 transition-all cursor-pointer"
            >
              {lang === "hi" ? "रद्द करें / Cancel" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
