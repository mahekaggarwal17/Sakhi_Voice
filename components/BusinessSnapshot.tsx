"use client";

import React from "react";
import { BusinessMemoryState } from "@/lib/agent/conversationState";
import { Package, Hash, Layers, MapPin, Tag, TrendingUp, Handshake, ShieldAlert, CheckCircle2, FileSpreadsheet } from "lucide-react";

interface BusinessSnapshotProps {
  memory: BusinessMemoryState;
  lang: "hi" | "en";
}

export const BusinessSnapshot: React.FC<BusinessSnapshotProps> = ({ memory, lang }) => {
  return (
    <div className="craft-card rounded-3xl p-5 lg:p-6 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100/90 border border-orange-200 flex items-center justify-center text-terracotta font-bold shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2A180D] text-base leading-tight">
              {lang === "hi" ? "लाइव ऑर्डर टिकट (Session Memory HUD)" : "Live Order Ticket (Session Memory HUD)"}
            </h3>
            <p className="text-[11px] text-[#785E4B]">
              {lang === "hi" ? "बातचीत से लाइव अपडेट होने वाली बिज़नेस जानकारी" : "Structured session parameters extracted in real-time"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300/80 rounded-full flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Synced
        </span>
      </div>

      {/* Structured Order Ticket HUD Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* 1. Product Name */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.product ? "bg-[#FDF9F3] border-[#E8D9C5] shadow-xs" : "bg-[#F9F5EE]/60 border-[#EFE5D6]"}`}>
          <span className="text-[11px] text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <Package className="w-3.5 h-3.5 text-terracotta" />
            {lang === "hi" ? "उत्पाद / Product" : "Product"}
          </span>
          <p className="font-bold text-[#2A180D] text-sm truncate">
            {memory.product || (
              <span className="text-[#A48F7B] italic font-normal text-xs">
                {lang === "hi" ? "सुनकर पहचान जारी..." : "Listening..."}
              </span>
            )}
          </p>
        </div>

        {/* 2. Quantity (Highlighted dynamically) */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.quantity ? "bg-[#FDF9F3] border-[#E8D9C5] shadow-xs" : "bg-[#F9F5EE]/60 border-[#EFE5D6]"}`}>
          <span className="text-[11px] text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <Hash className="w-3.5 h-3.5 text-terracotta" />
            {lang === "hi" ? "मात्रा / Quantity" : "Quantity"}
          </span>
          <p className="font-bold text-[#2A180D] text-sm flex items-center gap-1.5">
            {memory.quantity ? (
              <>
                <span className="text-terracotta font-extrabold text-base">{memory.quantity}</span>
                <span className="text-xs text-[#6F553F] font-semibold">units</span>
              </>
            ) : (
              <span className="text-[#A48F7B] italic font-normal text-xs">
                {lang === "hi" ? "पूछना बाकी" : "Pending"}
              </span>
            )}
          </p>
        </div>

        {/* 3. Location / Region */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.location ? "bg-[#FDF9F3] border-[#E8D9C5] shadow-xs" : "bg-[#F9F5EE]/60 border-[#EFE5D6]"}`}>
          <span className="text-[11px] text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta" />
            {lang === "hi" ? "स्थान / Location" : "Location"}
          </span>
          <p className="font-bold text-[#2A180D] text-xs truncate">
            {memory.location || (
              <span className="text-[#A48F7B] italic font-normal text-xs">
                {lang === "hi" ? "Greater Noida" : "Greater Noida"}
              </span>
            )}
          </p>
        </div>

        {/* 4. Verified Mandi Price */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.marketPriceRange ? "bg-emerald-50/80 border-emerald-200 shadow-xs" : "bg-[#F9F5EE]/60 border-[#EFE5D6]"}`}>
          <span className="text-[11px] text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            {lang === "hi" ? "मंडी दर / Market" : "Market Range"}
          </span>
          <p className="font-bold text-emerald-950 text-xs">
            {memory.marketPriceRange ? (
              `₹${memory.marketPriceRange.min} – ₹${memory.marketPriceRange.max}`
            ) : (
              <span className="text-[#A48F7B] italic font-normal text-xs">
                {lang === "hi" ? "टूल द्वारा चेक करें" : "Not queried yet"}
              </span>
            )}
          </p>
        </div>

        {/* 5. Matched Commercial Buyer */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.activeNegotiation.buyerName || memory.matchedBuyers.length > 0 ? "bg-indigo-50/70 border-indigo-200 shadow-xs" : "bg-[#F9F5EE]/60 border-[#EFE5D6]"}`}>
          <span className="text-[11px] text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <Handshake className="w-3.5 h-3.5 text-indigo-700" />
            {lang === "hi" ? "खरीदार / Buyer" : "Matched Buyer"}
          </span>
          <p className="font-bold text-[#2A180D] text-xs truncate">
            {memory.activeNegotiation.buyerName ? (
              memory.activeNegotiation.buyerName.split("(")[0]
            ) : memory.matchedBuyers.length > 0 ? (
              memory.matchedBuyers[0].name
            ) : (
              <span className="text-[#A48F7B] italic font-normal text-xs">
                {lang === "hi" ? "खोज जारी..." : "Pending"}
              </span>
            )}
          </p>
        </div>

        {/* 6. Deal Status / Safety Gate */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.activeNegotiation.status === "CONFIRMED" ? "bg-emerald-50 border-emerald-300 shadow-xs" : "bg-[#F9F5EE]/60 border-[#EFE5D6]"}`}>
          <span className="text-[11px] text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <Tag className="w-3.5 h-3.5 text-terracotta" />
            {lang === "hi" ? "सौदा / Deal Status" : "Deal Status"}
          </span>
          <div>
            {memory.activeNegotiation.status === "CONFIRMED" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                ✓ Recorded
              </span>
            ) : memory.activeNegotiation.status === "CALLING" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-orange-900 bg-orange-100 px-2 py-0.5 rounded-md animate-pulse">
                Calling Buyer
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#80644D]">
                {memory.conversationPhase}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Questioning Notice */}
      {memory.missingFields.length > 0 && memory.product && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
            {lang === "hi"
              ? `सखी अगली बातचीत में पूछेगी: ${memory.missingFields.join(", ")}`
              : `Pending dynamic parameters: ${memory.missingFields.join(", ")}`}
          </span>
          <span className="text-[10px] font-extrabold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md">
            Dynamic Memory
          </span>
        </div>
      )}
    </div>
  );
};
