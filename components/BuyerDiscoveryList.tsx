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
    <div className="bg-white rounded-3xl border-2 border-[#E7D9C4] p-5 lg:p-6 shadow-md shadow-orange-950/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
            <Handshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2C1D11] text-base">
              {lang === "hi" ? "उपयुक्त खरीदार (Matching Buyers)" : "Verified Matching Buyers"}
            </h3>
            <p className="text-[11px] text-[#7C634F]">
              {lang === "hi"
                ? `${buyers.length} खरीदार सीधे थोक में खरीदने के लिए उपलब्ध हैं`
                : `${buyers.length} verified commercial buyers found matching your product`}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
          Agora Ready
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
                  ? "bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-white border-orange-300 ring-2 ring-orange-200/60 shadow-sm"
                  : "bg-[#FBF8F3] border-[#ECE0CE] hover:border-orange-200"
              }`}
            >
              {/* Top Row: Name, Badge, Rating */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#27190D] text-sm lg:text-base">
                      {buyer.name}
                    </h4>
                    {isTopMatch && (
                      <span className="text-[10px] font-extrabold uppercase bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                        Top Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#7A614D]">
                    {buyer.organization}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{buyer.rating}</span>
                  <span className="text-[10px] text-amber-800 font-normal">({buyer.completedDeals})</span>
                </div>
              </div>

              {/* Requirement & Indicative Price */}
              <div className="grid grid-cols-2 gap-2 my-2.5 py-2 px-3 bg-white/80 rounded-xl border border-[#E9DDCB] text-xs">
                <div>
                  <span className="text-[11px] text-[#7C6552] block font-medium">
                    {lang === "hi" ? "मांग / Requirement" : "Requirement"}
                  </span>
                  <span className="font-bold text-[#2A1B10]">
                    {buyer.requiredQuantity}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#7C6552] block font-medium">
                    {lang === "hi" ? "शुरुआती बजट" : "Indicative Range"}
                  </span>
                  <span className="font-bold text-emerald-800">
                    {buyer.indicativePriceRange}
                  </span>
                </div>
              </div>

              {/* Location & Call Button */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <span className="text-[11px] text-[#695442] flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  {buyer.location} ({buyer.distanceKm} km)
                </span>

                <button
                  onClick={() => onSelectBuyerToCall(buyer)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 btn-tactile transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                  <span>
                    {lang === "hi" ? "लाइव बात करें (Start Call)" : "Talk to Buyer (Agora Call)"}
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
