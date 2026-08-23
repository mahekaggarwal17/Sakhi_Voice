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
    <div className="bg-gradient-to-br from-white to-[#FAF6F0] rounded-3xl border-2 border-purple-200 p-5 lg:p-6 shadow-md shadow-purple-950/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#2C1D11] text-base">
              {lang === "hi" ? "व्यापार सहायता एवं एनजीओ (Business Support)" : "Enterprise Support & Micro-Grants"}
            </h3>
            <p className="text-[11px] text-[#7C634F]">
              {lang === "hi" ? "महिला उद्यमियों के लिए सरकारी एवं एनजीओ अनुदान योजनाएं" : "Subsidies, expansion capital & SHG grants for women"}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full">
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
                  ? "bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20 border-purple-300 ring-2 ring-purple-200/50 shadow-sm"
                  : "bg-white border-[#E8DCcb]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                    {org.supportCategory}
                  </span>
                  <h4 className="font-bold text-[#27180D] text-sm sm:text-base mt-1">
                    {org.name}
                  </h4>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  {org.maxGrantAmount}
                </span>
              </div>

              <p className="text-xs text-[#5F4936] my-2 leading-relaxed">
                {lang === "hi" ? org.descriptionHindi : org.descriptionEnglish}
              </p>

              {/* Counselor Contact & Escalation Action */}
              <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#EFE4D4]">
                <div className="text-[11px] text-[#755D49]">
                  <span className="font-semibold text-[#2C1C10] block">
                    Counselor: {org.representativeName} ({org.representativeRole})
                  </span>
                  <span>{org.contactNumber}</span>
                </div>

                <button
                  onClick={() => onRequestHumanAssistance(org)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-800/25 flex items-center gap-1.5 btn-tactile transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>
                    {lang === "hi" ? "मानव सहायता मांगें (Request Help)" : "Request Human Assistance"}
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
