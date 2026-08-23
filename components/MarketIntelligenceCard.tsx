"use client";

import React from "react";
import { MarketPriceRecord } from "@/lib/data/seedMarket";
import { TrendingUp, ShieldCheck, ArrowUpRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface MarketIntelligenceCardProps {
  data: MarketPriceRecord;
  onFindBuyers: () => void;
  lang: "hi" | "en";
}

export const MarketIntelligenceCard: React.FC<MarketIntelligenceCardProps> = ({
  data,
  onFindBuyers,
  lang,
}) => {
  return (
    <div className="craft-card rounded-3xl p-5 lg:p-6 shadow-card border-2 border-emerald-300/80 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#ECE0CE] pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Verified Mandi Benchmark
            </span>
            <h3 className="font-bold text-[#2A180D] text-base mt-1 leading-tight">
              {data.product}
            </h3>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          {data.confidence} Source
        </span>
      </div>

      {/* Pricing Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
        {/* 1. Verified Mandi Range (Solid Border) */}
        <div className="p-4 bg-emerald-50/90 rounded-2xl border-2 border-emerald-300 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-950">
              {lang === "hi" ? "सरकारी मंडी दर (Verified Range)" : "Verified Mandi Range"}
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              ₹{data.minPrice} – ₹{data.maxPrice}
            </span>
            <span className="text-xs font-semibold text-emerald-800">/{data.unit}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Mandi Trend: {data.priceTrend}
          </span>
        </div>

        {/* 2. AI Estimated Anchor Rate (Dashed Border for Uncertainty & Truthfulness) */}
        <div className="p-4 bg-orange-50/90 rounded-2xl border-2 border-dashed border-orange-300 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-orange-950">
              {lang === "hi" ? "सखी सुझाई गई शुरुआत (AI Recommendation)" : "AI Suggested Counter Start"}
            </span>
            <span className="text-[10px] bg-orange-200 text-orange-900 font-extrabold px-1.5 py-0.5 rounded">
              ESTIMATE
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-terracotta">
              ₹{data.suggestedNegotiationStart}
            </span>
            <span className="text-xs font-semibold text-orange-800">/{data.unit}</span>
          </div>
          <span className="text-[11px] font-semibold text-orange-800 mt-1 block">
            {lang === "hi" ? "मोलभाव ₹220 से शुरू करने की सिफारिश" : "Recommended starting counter anchor"}
          </span>
        </div>
      </div>

      {/* Safety & Source Disclaimer */}
      <div className="p-3.5 bg-[#F6EFE5] rounded-2xl text-xs text-[#523B28] mb-4 space-y-1 border border-[#E7D7C1]">
        <div className="flex items-center gap-1.5 font-bold text-[#2A180D]">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{data.verifiedSource}</span>
        </div>
        <p className="text-[11px] text-[#7A604D] italic pl-5.5 leading-relaxed">
          {lang === "hi"
            ? "यह मूल्य हालिया थोक मंडी डेटा पर आधारित संदर्भ है। अंतिम सौदा आपके और खरीदार की आपसी सहमति पर निर्भर करता है।"
            : "Data reflects verified wholesale handicrafts benchmarks. Final deal price requires your explicit mutual agreement."}
        </p>
      </div>

      {/* Action to find matching buyers */}
      <button
        onClick={onFindBuyers}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-[#7A240B] text-white font-bold text-sm rounded-2xl shadow-tactile flex items-center justify-center gap-2 btn-craft cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>
          {lang === "hi"
            ? "इस उत्पाद के थोक खरीदार खोजें (Find Verified Buyers)"
            : "Find Verified Buyers for this Product"}
        </span>
      </button>
    </div>
  );
};
