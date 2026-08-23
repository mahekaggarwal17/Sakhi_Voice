"use client";

import React from "react";
import { SupportOrganization } from "@/lib/data/seedSupport";
import { HeartHandshake, ShieldCheck, PhoneCall, Sparkles, Building2, CheckCircle2, ArrowRight } from "lucide-react";

interface NgoSupportCardProps {
  organizations: SupportOrganization[];
  onRequestHumanAssistance: (org: SupportOrganization) => void;
  lang: "hi" | "en";
}

export const NgoSupportCard: React.FC<NgoSupportCardProps> = ({
  organizations,
  onRequestHumanAssistance,
  lang,
}) => {
  return (
    <div className="bg-white rounded-4xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-400 font-bold shadow-xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base tracking-tight leading-tight">
                {lang === "hi" ? "व्यापार सहायता एवं एनजीओ (Grants)" : "Enterprise Support & Micro-Grants"}
              </h3>
              <p className="text-[11px] text-zinc-500">
                {lang === "hi" ? "महिला उद्यमियों के लिए सरकारी एवं एनजीओ अनुदान योजनाएं" : "Subsidies, capacity capital & SHG micro-grants"}
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
            Verified Schemes
          </span>
        </div>

        {/* Support Org Cards */}
        <div className="space-y-3.5 mb-4">
          {organizations.map((org, idx) => {
            const isTop = idx === 0;

            return (
              <div
                key={org.id}
                className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded-md">
                      {org.supportCategory}
                    </span>
                    <h4 className="font-bold text-zinc-900 text-sm sm:text-base mt-1.5 tracking-tight">
                      {org.name}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl">
                    {org.maxGrantAmount}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 my-2 leading-relaxed font-normal">
                  {lang === "hi" ? org.descriptionHindi : org.descriptionEnglish}
                </p>

                {/* Counselor Contact & Escalation Action */}
                <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-zinc-200">
                  <div className="text-[11px] text-zinc-600">
                    <span className="font-bold text-zinc-900 block">
                      Counselor: {org.representativeName} ({org.representativeRole})
                    </span>
                    <span className="text-zinc-500">{org.contactNumber}</span>
                  </div>

                  <button
                    onClick={() => onRequestHumanAssistance(org)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {lang === "hi" ? "काउंसलर से बात करें" : "Talk to Counselor"}
                    </span>
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
