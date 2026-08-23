"use client";

import React from "react";
import { BusinessMemoryState } from "@/lib/agent/conversationState";
import { Package, Hash, Layers, MapPin, Tag, TrendingUp, Handshake, ShieldAlert, CheckCircle2 } from "lucide-react";

interface BusinessSnapshotProps {
  memory: BusinessMemoryState;
  lang: "hi" | "en";
}

export const BusinessSnapshot: React.FC<BusinessSnapshotProps> = ({ memory, lang }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-[#E7D9C4] p-5 lg:p-6 shadow-md shadow-orange-950/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2C1D11] text-base">
              {lang === "hi" ? "बिज़नेस मेमोरी (Business Snapshot)" : "Live Business Memory & State"}
            </h3>
            <p className="text-[11px] text-[#7C634F]">
              {lang === "hi" ? "सखी द्वारा लाइव बातचीत से याद रखी गई जानकारी" : "Structured attributes preserved across conversation"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Session Synced
        </span>
      </div>

      {/* Snapshot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* 1. Product Name */}
        <div className="p-3 bg-[#FBF8F3] rounded-2xl border border-[#ECE0CE]">
          <span className="text-[11px] text-[#7B6450] font-semibold flex items-center gap-1 mb-1">
            <Package className="w-3 h-3 text-orange-600" />
            {lang === "hi" ? "उत्पाद / Product" : "Product"}
          </span>
          <p className="font-bold text-[#2B1B10] text-sm truncate">
            {memory.product || (
              <span className="text-[#A58F7B] italic font-normal">
                {lang === "hi" ? "पहचान की जा रही है..." : "Not specified"}
              </span>
            )}
          </p>
        </div>

        {/* 2. Quantity (Highlighted when updated) */}
        <div className="p-3 bg-[#FBF8F3] rounded-2xl border border-[#ECE0CE]">
          <span className="text-[11px] text-[#7B6450] font-semibold flex items-center gap-1 mb-1">
            <Hash className="w-3 h-3 text-orange-600" />
            {lang === "hi" ? "मात्रा / Quantity" : "Quantity"}
          </span>
          <p className="font-bold text-[#2B1B10] text-sm flex items-center gap-1.5">
            {memory.quantity ? (
              <>
                <span className="text-orange-700 font-extrabold text-base">{memory.quantity}</span>
                <span className="text-xs text-[#6F5743]">units</span>
              </>
            ) : (
              <span className="text-[#A58F7B] italic font-normal">
                {lang === "hi" ? "पूछना बाकी" : "Pending"}
              </span>
            )}
          </p>
        </div>

        {/* 3. Material / Craft */}
        <div className="p-3 bg-[#FBF8F3] rounded-2xl border border-[#ECE0CE]">
          <span className="text-[11px] text-[#7B6450] font-semibold flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-orange-600" />
            {lang === "hi" ? "सामग्री / Material" : "Material / Type"}
          </span>
          <p className="font-bold text-[#2B1B10] text-xs truncate">
            {memory.materialOrVariety || (
              <span className="text-[#A58F7B] italic font-normal">
                {lang === "hi" ? "Bamboo / Cane" : "Bamboo / Cane"}
              </span>
            )}
          </p>
        </div>

        {/* 4. Verified Market Price */}
        <div className="p-3 bg-[#FBF8F3] rounded-2xl border border-[#ECE0CE]">
          <span className="text-[11px] text-[#7B6450] font-semibold flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            {lang === "hi" ? "मंडी रेट / Market" : "Market Range"}
          </span>
          <p className="font-bold text-emerald-800 text-xs">
            {memory.marketPriceRange ? (
              `₹${memory.marketPriceRange.min} – ₹${memory.marketPriceRange.max}`
            ) : (
              <span className="text-[#A58F7B] italic font-normal">
                {lang === "hi" ? "टूल से चेक करें" : "Not queried"}
              </span>
            )}
          </p>
        </div>

        {/* 5. Matched Buyer */}
        <div className="p-3 bg-[#FBF8F3] rounded-2xl border border-[#ECE0CE]">
          <span className="text-[11px] text-[#7B6450] font-semibold flex items-center gap-1 mb-1">
            <Handshake className="w-3 h-3 text-blue-600" />
            {lang === "hi" ? "खरीदार / Buyer" : "Matched Buyer"}
          </span>
          <p className="font-bold text-[#2B1B10] text-xs truncate">
            {memory.activeNegotiation.buyerName || (
              memory.matchedBuyers.length > 0 ? (
                memory.matchedBuyers[0].name
              ) : (
                <span className="text-[#A58F7B] italic font-normal">
                  {lang === "hi" ? "खोज बाकी" : "Pending search"}
                </span>
              )
            )}
          </p>
        </div>

        {/* 6. Deal Status */}
        <div className="p-3 bg-[#FBF8F3] rounded-2xl border border-[#ECE0CE]">
          <span className="text-[11px] text-[#7B6450] font-semibold flex items-center gap-1 mb-1">
            <Tag className="w-3 h-3 text-orange-600" />
            {lang === "hi" ? "सौदा स्थिति / Status" : "Deal Status"}
          </span>
          <div>
            {memory.activeNegotiation.status === "CONFIRMED" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                ✓ Recorded
              </span>
            ) : memory.activeNegotiation.status === "CALLING" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md animate-pulse">
                Calling Buyer
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#846C57]">
                {memory.conversationPhase}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Missing Information Banner if any */}
      {memory.missingFields.length > 0 && memory.product && (
        <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            {lang === "hi"
              ? `सखी अगली बातचीत में पूछेगी: ${memory.missingFields.join(", ")}`
              : `Pending dynamic questions: ${memory.missingFields.join(", ")}`}
          </span>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
            Dynamic AI
          </span>
        </div>
      )}
    </div>
  );
};
