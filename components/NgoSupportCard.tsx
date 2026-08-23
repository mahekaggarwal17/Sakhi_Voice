"use client";

import React from "react";
import { SupportOrganization } from "@/lib/data/seedSupport";
import { HeartHandshake, ShieldCheck, PhoneCall, Sparkles, Building2, CheckCircle2 } from "lucide-react";

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
    <div className="craft-card rounded-3xl p-5 lg:p-6 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigoCraft-50 border border-indigoCraft-200 flex items-center justify-center text-indigoCraft font-bold shadow-xs">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2A180D] text-base leading-tight">
              {lang === "hi" ? "व्यापार सहायता एवं एनजीओ (Business Grants)" : "Enterprise Support & Micro-Grants"}
            </h3>
            <p className="text-[11px] text-[#785E4B]">
              {lang === "hi" ? "महिला उद्यमियों के लिए सरकारी एवं एनजीओ अनुदान योजनाएं" : "Subsidies, capacity capital & SHG grants for women"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-full shadow-xs">
          Verified Schemes
        </span>
      </div>

      {/* Support Org Cards */}
      <div className="space-y-3.5">
        {organizations.map((org, idx) => {
          const isTop = idx === 0;

          return (
            <div
              key={org.id}
              className={`p-4 rounded-2xl border transition-all ${
                isTop
                  ? "bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border-indigoCraft/40 ring-2 ring-indigoCraft/15 shadow-xs"
                  : "bg-[#FAF5EC]/80 border-[#E8DCcb]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigoCraft bg-indigoCraft-100/80 px-2.5 py-0.5 rounded-md border border-indigoCraft-200">
                    {org.supportCategory}
                  </span>
                  <h4 className="font-bold text-[#2A180D] text-sm sm:text-base mt-1.5">
                    {org.name}
                  </h4>
                </div>
                <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl shadow-xs">
                  {org.maxGrantAmount}
                </span>
              </div>

              <p className="text-xs text-[#5D4634] my-2 leading-relaxed font-medium">
                {lang === "hi" ? org.descriptionHindi : org.descriptionEnglish}
              </p>

              {/* Counselor Contact & Escalation Action */}
              <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#EFE4D4]">
                <div className="text-[11px] text-[#755D49]">
                  <span className="font-bold text-[#2A180D] block">
                    Counselor: {org.representativeName} ({org.representativeRole})
                  </span>
                  <span className="font-medium text-[#846C58]">{org.contactNumber}</span>
                </div>

                <button
                  onClick={() => onRequestHumanAssistance(org)}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigoCraft to-indigoCraft-800 hover:from-indigoCraft-800 hover:to-black text-white font-bold text-xs rounded-xl shadow-tactile flex items-center gap-2 btn-craft cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>
                    {lang === "hi" ? "काउंसलर से बात करें (Request Help)" : "Talk to Counselor (Zero Repetition)"}
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
