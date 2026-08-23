"use client";

import React from "react";
import { ShieldCheck, AlertCircle, Handshake, CheckCircle2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-orange-400 shadow-2xl p-6 lg:p-7 relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-[#7C6552] hover:text-red-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Safety Icon */}
        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4 border border-orange-200 shadow-sm">
          <Handshake className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#2B1B0F] mb-1">
          {lang === "hi" ? "सौदा पक्का करने की पुष्टि (Confirm Deal)" : "Commercial Deal Confirmation Required"}
        </h3>
        <p className="text-xs text-[#7B634E] mb-5">
          {lang === "hi"
            ? "सखी आपके स्पष्ट निर्णय के बिना कोई भी अंतिम व्यावसायिक फैसला नहीं लेती है।"
            : "Sakhi Voice requires explicit user authorization before recording binding deals."}
        </p>

        {/* Deal Summary Box */}
        <div className="bg-[#FAF5ED] rounded-2xl p-4 border border-[#E9DDCB] space-y-3 mb-6">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#ECE0CF]">
            <span className="text-[#745E4A] font-semibold">{lang === "hi" ? "खरीदार / Buyer" : "Buyer"}:</span>
            <span className="font-bold text-[#24170D]">{buyerName} ({organization})</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#ECE0CF]">
            <span className="text-[#745E4A] font-semibold">{lang === "hi" ? "उत्पाद एवं मात्रा" : "Product & Quantity"}:</span>
            <span className="font-bold text-[#24170D]">{quantity} {product}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#ECE0CF]">
            <span className="text-[#745E4A] font-semibold">{lang === "hi" ? "तय किया गया मूल्य" : "Agreed Price"}:</span>
            <span className="font-extrabold text-emerald-800 text-sm">₹{agreedPrice} / unit</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-[#745E4A] font-bold">{lang === "hi" ? "कुल सौदा राशि (Total)" : "Total Deal Amount"}:</span>
            <span className="text-xl font-extrabold text-orange-900">
              ₹{totalValue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 btn-tactile transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {lang === "hi" ? "सौदा पक्का करें (CONFIRM DEAL)" : "CONFIRM DEAL & RECORD"}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNegotiateMore}
              className="py-2.5 px-3 bg-[#EFE6D9] hover:bg-[#E2D6C5] text-[#3F2B1A] font-bold text-xs rounded-xl transition-all"
            >
              {lang === "hi" ? "और मोलभाव करें" : "Negotiate More"}
            </button>
            <button
              onClick={onCancel}
              className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-[#554333] font-semibold text-xs rounded-xl transition-all"
            >
              {lang === "hi" ? "रद्द करें / Cancel" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
