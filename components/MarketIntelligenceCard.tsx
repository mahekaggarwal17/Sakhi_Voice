"use client";

import React from "react";
import { MarketPriceRecord } from "@/lib/data/seedMarket";
import { TrendingUp, ShieldCheck, ArrowUpRight, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

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
    <div className="bg-white rounded-4xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-400 font-bold shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Mandi Benchmark
              </span>
              <h3 className="font-bold text-zinc-900 text-base mt-1 tracking-tight leading-tight">
                {data.product}
              </h3>
            </div>
          </div>

          <span className="text-xs font-bold text-zinc-800 bg-zinc-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {data.confidence}
          </span>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
          {/* Verified Mandi Range */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-zinc-700">
                {lang === "hi" ? "सरकारी मंडी दर (Verified Range)" : "Verified Mandi Range"}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">
                VERIFIED
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                ₹{data.minPrice} – ₹{data.maxPrice}
              </span>
              <span className="text-xs font-semibold text-zinc-500">/{data.unit}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Mandi Trend: {data.priceTrend}
            </span>
          </div>

          {/* AI Estimated Recommendation */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-zinc-700">
                {lang === "hi" ? "सखी सुझाई गई शुरुआत (Recommendation)" : "AI Suggested Counter Start"}
              </span>
              <span className="text-[10px] bg-zinc-200 text-zinc-700 font-bold px-1.5 py-0.5 rounded">
                ESTIMATE
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                ₹{data.suggestedNegotiationStart}
              </span>
              <span className="text-xs font-semibold text-zinc-500">/{data.unit}</span>
            </div>
            <span className="text-[11px] font-medium text-zinc-600 mt-1 block">
              {lang === "hi" ? "बातचीत ₹220 से शुरू करने की सलाह" : "Recommended starting counter anchor"}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-600 mb-4 space-y-1 border border-zinc-100">
          <div className="flex items-center gap-1.5 font-bold text-zinc-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{data.verifiedSource}</span>
          </div>
          <p className="text-[11px] text-zinc-500 italic pl-5">
            {lang === "hi"
              ? "यह मूल्य हालिया थोक मंडी डेटा पर आधारित संदर्भ है।"
              : "Data reflects verified wholesale handicrafts benchmarks. Final deal price requires mutual agreement."}
          </p>
        </div>
      </div>

      {/* Bento Full-Width Action Button */}
      <button
        onClick={onFindBuyers}
        className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer shadow-md"
      >
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>
          {lang === "hi"
            ? "इस उत्पाद के खरीदार खोजें (Find Verified Buyers)"
            : "Find Verified Buyers for this Product"}
        </span>
        <ArrowRight className="w-4 h-4 text-emerald-400" />
      </button>
    </div>
  );
};
