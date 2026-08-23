"use client";

import React from "react";
import { BuyerProfile } from "@/lib/data/seedBuyers";
import { Handshake, PhoneCall, Star, MapPin, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";

interface BuyerDiscoveryListProps {
  buyers: BuyerProfile[];
  onSelectBuyerToCall: (buyer: BuyerProfile) => void;
  lang: "hi" | "en";
}

export const BuyerDiscoveryList: React.FC<BuyerDiscoveryListProps> = ({
  buyers,
  onSelectBuyerToCall,
  lang,
}) => {
  return (
    <div className="craft-card rounded-3xl p-5 lg:p-6 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigoCraft-50 border border-indigoCraft-200 flex items-center justify-center text-indigoCraft font-bold shadow-xs">
            <Handshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2A180D] text-base leading-tight">
              {lang === "hi" ? "उपलब्ध थोक खरीदार (Verified Buyers)" : "Verified Matching Buyers"}
            </h3>
            <p className="text-[11px] text-[#785E4B]">
              {lang === "hi"
                ? `${buyers.length} सत्यापित खरीदार सीधे खरीदने के लिए तैयार हैं`
                : `${buyers.length} commercial buyers matching your craft & location`}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-full shadow-xs">
          Agora Live Call Ready
        </span>
      </div>

      {/* Buyer Cards */}
      <div className="space-y-3.5">
        {buyers.map((buyer, idx) => {
          const isTopMatch = idx === 0;

          return (
            <div
              key={buyer.id}
              className={`p-4 rounded-2xl border transition-all ${
                isTopMatch
                  ? "bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#FFFDF9] border-terracotta/40 ring-2 ring-terracotta/20 shadow-xs"
                  : "bg-[#FAF5EC]/80 border-[#E8DCcb] hover:border-terracotta/30"
              }`}
            >
              {/* Top Row: Name, Badge, Rating */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#2A180D] text-sm lg:text-base">
                      {buyer.name}
                    </h4>
                    {isTopMatch && (
                      <span className="text-[10px] font-extrabold uppercase bg-terracotta text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        Top Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#785E4B]">
                    {buyer.organization}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-100/90 text-amber-950 px-2.5 py-1 rounded-xl text-xs font-bold border border-amber-300 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{buyer.rating}</span>
                  <span className="text-[10px] text-amber-900 font-semibold">({buyer.completedDeals})</span>
                </div>
              </div>

              {/* Requirement & Indicative Price */}
              <div className="grid grid-cols-2 gap-2 my-2.5 py-2.5 px-3.5 bg-white/90 rounded-xl border border-[#E9DDCB] text-xs">
                <div>
                  <span className="text-[11px] text-[#7A604D] block font-semibold">
                    {lang === "hi" ? "आवश्यकता / Demand" : "Requirement"}
                  </span>
                  <span className="font-bold text-[#2A180D]">
                    {buyer.requiredQuantity}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#7A604D] block font-semibold">
                    {lang === "hi" ? "शुरुआती ऑफर बजट" : "Budget Range"}
                  </span>
                  <span className="font-bold text-emerald-900">
                    {buyer.indicativePriceRange}
                  </span>
                </div>
              </div>

              {/* Location & Call Button */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <span className="text-[11px] text-[#69503B] flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  {buyer.location} ({buyer.distanceKm} km)
                </span>

                <button
                  onClick={() => onSelectBuyerToCall(buyer)}
                  className="px-4 py-2.5 bg-gradient-to-r from-terracotta to-terracotta-dark hover:from-terracotta-dark hover:to-[#78220A] text-white font-bold text-xs rounded-xl shadow-tactile flex items-center gap-2 btn-craft cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                  <span>
                    {lang === "hi" ? "लाइव बात करें (Agora Call)" : "Talk to Buyer (Agora Call)"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
