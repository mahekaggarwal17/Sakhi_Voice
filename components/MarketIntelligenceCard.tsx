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
    <div className="bg-gradient-to-br from-white to-[#FBF8F3] rounded-3xl border-2 border-emerald-200 p-5 lg:p-6 shadow-lg shadow-emerald-950/5 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#ECE0CE] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Market Intelligence
            </span>
            <h3 className="font-bold text-[#2C1D11] text-base mt-0.5">
              {data.product}
            </h3>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          {data.confidence} Source
        </span>
      </div>

      {/* Pricing Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
        {/* Market Range */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-900 block mb-1">
            {lang === "hi" ? "उपलब्ध मंडी / मार्केट दर (Range)" : "Available Market Range"}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl lg:text-3xl font-extrabold text-emerald-950">
              ₹{data.minPrice} – ₹{data.maxPrice}
            </span>
            <span className="text-xs font-medium text-emerald-800">/{data.unit}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Trend: {data.priceTrend}
          </span>
        </div>

        {/* Suggested Negotiation Anchor */}
        <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200">
          <span className="text-xs font-semibold text-orange-900 block mb-1">
            {lang === "hi" ? "सखी द्वारा सुझाई गई शुरुआत (Recommendation)" : "AI Suggested Anchor Rate"}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl lg:text-3xl font-extrabold text-orange-900">
              ₹{data.suggestedNegotiationStart}
            </span>
            <span className="text-xs font-medium text-orange-800">/{data.unit}</span>
          </div>
          <span className="text-[11px] font-medium text-orange-700 mt-1 block">
            {lang === "hi" ? "बातचीत ₹220 से शुरू करने की सलाह है" : "Recommended starting counter-offer"}
          </span>
        </div>
      </div>

      {/* Verified Source Metadata */}
      <div className="p-3 bg-[#F4EDE2] rounded-xl text-xs text-[#5D4733] mb-4 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#2D1E12]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{data.verifiedSource}</span>
        </div>
        <p className="text-[11px] text-[#7C634F] italic pl-5">
          {lang === "hi"
            ? "यह मूल्य अनुमानित मार्केट रेंज है, कोई निश्चित गारंटी नहीं। अंतिम फैसला आपका है।"
            : "Data represents recent wholesale aggregate trades. Final deal price depends on mutual agreement."}
        </p>
      </div>

      {/* Action to find matching buyers */}
      <button
        onClick={onFindBuyers}
        className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 btn-tactile"
      >
        <Sparkles className="w-4 h-4" />
        <span>
          {lang === "hi"
            ? "इस उत्पाद के खरीदार खोजें (Find Matching Buyers)"
            : "Find Matching Buyers for this Product"}
        </span>
      </button>
    </div>
  );
};
