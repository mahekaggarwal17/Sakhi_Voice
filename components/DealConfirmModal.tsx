"use client";

import React from "react";
import { ShieldCheck, AlertCircle, Handshake, CheckCircle2, X, Lock } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFFDF9] w-full max-w-lg rounded-3xl border-3 border-terracotta/40 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Top Decorative Terracotta Border Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-terracotta via-marigold to-terracotta-dark" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-[#7C604B] hover:text-red-700 rounded-full hover:bg-[#F3ECE1] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Safety Gate Seal */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100/90 text-terracotta flex items-center justify-center border-2 border-amber-300 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-extrabold tracking-wider uppercase border border-emerald-300">
              <Lock className="w-3 h-3 text-emerald-700" />
              Human-in-the-Loop Safety Gate
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2A180D] mt-0.5 leading-tight">
              {lang === "hi" ? "सौदा पक्का करने की स्वीकृति (Confirm Deal)" : "Explicit Deal Authorization Required"}
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#7A604C] mb-5 leading-relaxed">
          {lang === "hi"
            ? "सखी आपके स्पष्ट आदेश के बिना डेटाबेस में कोई भी स्थायी सौदा दर्ज नहीं करती है।"
            : "Sakhi Voice requires your explicit verbal or one-tap authorization before recording legally binding deals."}
        </p>

        {/* Deal Summary Order Ticket */}
        <div className="bg-[#FAF5EC] rounded-2xl p-4 border border-[#E9DAC6] space-y-2.5 mb-6 shadow-xs">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#ECE0CF]">
            <span className="text-[#755D4A] font-semibold">{lang === "hi" ? "खरीदार / Buyer" : "Buyer"}:</span>
            <span className="font-bold text-[#2A180D]">{buyerName} ({organization})</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#ECE0CF]">
            <span className="text-[#755D4A] font-semibold">{lang === "hi" ? "उत्पाद एवं मात्रा" : "Product & Quantity"}:</span>
            <span className="font-bold text-[#2A180D]">{quantity} {product}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#ECE0CF]">
            <span className="text-[#755D4A] font-semibold">{lang === "hi" ? "तय किया गया मूल्य" : "Agreed Price"}:</span>
            <span className="font-extrabold text-emerald-950 text-sm">₹{agreedPrice} / unit</span>
          </div>
          <div className="flex justify-between items-center pt-1.5">
            <span className="text-xs text-[#755D4A] font-bold">{lang === "hi" ? "कुल सौदा राशि (Total Value)" : "Total Deal Amount"}:</span>
            <span className="text-2xl font-extrabold text-terracotta">
              ₹{totalValue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onConfirm}
            className="w-full py-4 px-4 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm rounded-2xl shadow-tactile flex items-center justify-center gap-2 btn-craft cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {lang === "hi" ? "हाँ, सौदा पक्का करें (CONFIRM DEAL)" : "CONFIRM DEAL & RECORD IN DATABASE"}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNegotiateMore}
              className="py-2.5 px-3 bg-[#EFE5D6] hover:bg-[#E3D4BF] text-[#3D2614] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {lang === "hi" ? "और मोलभाव करें" : "Negotiate Further"}
            </button>
            <button
              onClick={onCancel}
              className="py-2.5 px-3 bg-[#FAF5EC] hover:bg-gray-200 text-[#634E3C] font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              {lang === "hi" ? "रद्द करें / Cancel" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
