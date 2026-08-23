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
    <div className="bg-white rounded-4xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-400 font-bold shadow-xs">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base tracking-tight leading-tight">
                {lang === "hi" ? "उपलब्ध थोक खरीदार (Verified Buyers)" : "Verified Commercial Buyers"}
              </h3>
              <p className="text-[11px] text-zinc-500">
                {lang === "hi"
                  ? `${buyers.length} सत्यापित खरीदार सीधे खरीदने के लिए तैयार हैं`
                  : `${buyers.length} commercial buyers matching your craft`}
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
            Agora RTC Ready
          </span>
        </div>

        {/* Buyer Cards */}
        <div className="space-y-3 mb-4">
          {buyers.map((buyer, idx) => {
            const isTopMatch = idx === 0;

            return (
              <div
                key={buyer.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isTopMatch
                    ? "bg-zinc-900 text-white border-zinc-800 shadow-md"
                    : "bg-zinc-50 text-zinc-900 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {/* Top Row: Name, Badge, Rating */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm lg:text-base tracking-tight">
                        {buyer.name}
                      </h4>
                      {isTopMatch && (
                        <span className="text-[10px] font-black uppercase bg-emerald-400 text-zinc-950 px-2 py-0.5 rounded-full">
                          Top Match
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-medium ${isTopMatch ? "text-zinc-400" : "text-zinc-600"}`}>
                      {buyer.organization}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${isTopMatch ? "bg-white/10 text-white" : "bg-zinc-200 text-zinc-900"}`}>
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>{buyer.rating}</span>
                    <span className={`text-[10px] ${isTopMatch ? "text-zinc-400" : "text-zinc-500"}`}>({buyer.completedDeals})</span>
                  </div>
                </div>

                {/* Requirement & Indicative Price */}
                <div className={`grid grid-cols-2 gap-2 my-2.5 py-2 px-3 rounded-xl text-xs ${isTopMatch ? "bg-white/5 border border-white/10" : "bg-white border border-zinc-200"}`}>
                  <div>
                    <span className={`text-[10px] uppercase font-bold block ${isTopMatch ? "text-zinc-400" : "text-zinc-500"}`}>
                      Demand
                    </span>
                    <span className="font-bold">
                      {buyer.requiredQuantity}
                    </span>
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase font-bold block ${isTopMatch ? "text-zinc-400" : "text-zinc-500"}`}>
                      Budget
                    </span>
                    <span className={`font-bold ${isTopMatch ? "text-emerald-400" : "text-emerald-600"}`}>
                      {buyer.indicativePriceRange}
                    </span>
                  </div>
                </div>

                {/* Location & Call Button */}
                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className={`text-[11px] flex items-center gap-1 font-medium ${isTopMatch ? "text-zinc-400" : "text-zinc-600"}`}>
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {buyer.location} ({buyer.distanceKm} km)
                  </span>

                  <button
                    onClick={() => onSelectBuyerToCall(buyer)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isTopMatch
                        ? "bg-white text-zinc-950 hover:bg-zinc-100"
                        : "bg-zinc-900 text-white hover:bg-black"
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                    <span>Talk (Agora Call)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
