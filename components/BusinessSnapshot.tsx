"use client";

import React from "react";
import { BusinessMemoryState } from "@/lib/agent/conversationState";
import { Package, Hash, Layers, MapPin, Tag, TrendingUp, Handshake, ShieldAlert, CheckCircle2, FileSpreadsheet, Sparkles } from "lucide-react";

interface BusinessSnapshotProps {
  memory: BusinessMemoryState;
  lang: "hi" | "en";
}

export const BusinessSnapshot: React.FC<BusinessSnapshotProps> = ({ memory, lang }) => {
  return (
    <div className="glass-stat-card rounded-3xl p-5 lg:p-6 text-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 font-bold">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight leading-tight">
              {lang === "hi" ? "लाइव ऑर्डर टिकट (Session Memory HUD)" : "Live Order Ticket (Session Memory HUD)"}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {lang === "hi" ? "बातचीत से लाइव अपडेट होने वाली बिज़नेस जानकारी" : "Structured parameters extracted across live dialogue"}
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live Synced
        </span>
      </div>

      {/* Structured Order Ticket HUD Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* 1. Product Name */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.product ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"}`}>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1">
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "उत्पाद / Product" : "Product"}
          </span>
          <p className="font-bold text-white text-sm truncate">
            {memory.product || (
              <span className="text-zinc-500 italic font-normal text-xs">
                {lang === "hi" ? "पहचान जारी..." : "Listening..."}
              </span>
            )}
          </p>
        </div>

        {/* 2. Quantity */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.quantity ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"}`}>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "मात्रा / Quantity" : "Quantity"}
          </span>
          <p className="font-bold text-white text-sm flex items-center gap-1.5">
            {memory.quantity ? (
              <>
                <span className="text-emerald-400 font-black text-base">{memory.quantity}</span>
                <span className="text-xs text-zinc-400 font-semibold">units</span>
              </>
            ) : (
              <span className="text-zinc-500 italic font-normal text-xs">
                {lang === "hi" ? "पूछना बाकी" : "Pending"}
              </span>
            )}
          </p>
        </div>

        {/* 3. Location */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.location ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"}`}>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "स्थान / Location" : "Location"}
          </span>
          <p className="font-bold text-white text-xs truncate">
            {memory.location || (
              <span className="text-zinc-500 italic font-normal text-xs">
                {lang === "hi" ? "Greater Noida" : "Greater Noida"}
              </span>
            )}
          </p>
        </div>

        {/* 4. Mandi Price Range */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.marketPriceRange ? "bg-emerald-950/40 border-emerald-500/40" : "bg-white/5 border-white/5"}`}>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "मंडी दर / Market" : "Market Range"}
          </span>
          <p className="font-bold text-emerald-300 text-xs">
            {memory.marketPriceRange ? (
              `₹${memory.marketPriceRange.min} – ₹${memory.marketPriceRange.max}`
            ) : (
              <span className="text-zinc-500 italic font-normal text-xs">
                {lang === "hi" ? "टूल से चेक करें" : "Not queried"}
              </span>
            )}
          </p>
        </div>

        {/* 5. Matched Buyer */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.activeNegotiation.buyerName || memory.matchedBuyers.length > 0 ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"}`}>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1">
            <Handshake className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "खरीदार / Buyer" : "Matched Buyer"}
          </span>
          <p className="font-bold text-white text-xs truncate">
            {memory.activeNegotiation.buyerName ? (
              memory.activeNegotiation.buyerName.split("(")[0]
            ) : memory.matchedBuyers.length > 0 ? (
              memory.matchedBuyers[0].name
            ) : (
              <span className="text-zinc-500 italic font-normal text-xs">
                {lang === "hi" ? "खोज बाकी" : "Pending"}
              </span>
            )}
          </p>
        </div>

        {/* 6. Deal Status */}
        <div className={`p-3 rounded-2xl border transition-all ${memory.activeNegotiation.status === "CONFIRMED" ? "bg-emerald-950/60 border-emerald-500/50" : "bg-white/5 border-white/5"}`}>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "सौदा / Deal Status" : "Deal Status"}
          </span>
          <div>
            {memory.activeNegotiation.status === "CONFIRMED" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                ✓ Recorded
              </span>
            ) : memory.activeNegotiation.status === "CALLING" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                Calling Buyer
              </span>
            ) : (
              <span className="text-xs font-semibold text-zinc-400">
                {memory.conversationPhase}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Questioning Notice */}
      {memory.missingFields.length > 0 && memory.product && (
        <div className="mt-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {lang === "hi"
              ? `सखी अगली बातचीत में पूछेगी: ${memory.missingFields.join(", ")}`
              : `Pending dynamic parameters: ${memory.missingFields.join(", ")}`}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-emerald-400 px-2 py-0.5 rounded-full border border-white/10">
            Dynamic Memory
          </span>
        </div>
      )}
    </div>
  );
};
