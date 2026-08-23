"use client";

import React from "react";
import { TrendingUp, PackageCheck, DollarSign, Users, Award, FileText, ArrowUpRight, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import { RECORDED_DEALS, RECORDED_CASES } from "@/lib/agent/tools";

interface ImpactDashboardProps {
  lang: "hi" | "en";
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ lang }) => {
  // Aggregate real recorded deals from session
  const totalRevenue = RECORDED_DEALS.reduce((acc, curr) => acc + curr.totalValue, 0) || 30750; // Fallback baseline with live deal
  const totalUnitsSold = RECORDED_DEALS.reduce((acc, curr) => acc + curr.quantity, 0) || 150;
  const dealsCount = RECORDED_DEALS.length || 1;
  const casesCount = RECORDED_CASES.length || 1;

  // Earnings trend data points for chart
  const weeklyData = [
    { day: "Mon", amount: 4500, units: 25 },
    { day: "Tue", amount: 6200, units: 30 },
    { day: "Wed", amount: 3800, units: 18 },
    { day: "Thu", amount: 8400, units: 42 },
    { day: "Fri", amount: 7200, units: 35 },
    { day: "Sat", amount: 11500, units: 55 },
    { day: "Today (Sakhi Deal)", amount: 30750, units: 150 },
  ];

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount));

  return (
    <div className="gramya-card rounded-3xl p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE5D6] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold shadow-xs">
            <Award className="w-5 h-5 text-[#c05b3f]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#201610] text-lg lg:text-xl">
              {lang === "hi" ? "उद्यमी प्रभाव एवं कमाई डैशबोर्ड (Impact Dashboard)" : "Rural Artisan Impact & Earnings Dashboard"}
            </h3>
            <p className="text-xs text-[#785E4B]">
              {lang === "hi"
                ? "सखी वॉयस एजेंट द्वारा बंद किए गए सौदे, कुल कमाई और एनजीओ अनुदान स्थिति"
                : "Real-time earnings, closed bulk orders, and financial empowerment tracking"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold w-fit shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          100% Direct to Artisan Account
        </span>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Earnings */}
        <div className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#E9DAC6] shadow-xs">
          <span className="text-xs text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <DollarSign className="w-4 h-4 text-[#c05b3f]" />
            {lang === "hi" ? "कुल कमाई / Revenue" : "Total Revenue"}
          </span>
          <p className="text-2xl font-black text-[#c05b3f]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-bold text-emerald-700 mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +100% via Voice AI
          </span>
        </div>

        {/* 2. Units Sold */}
        <div className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#E9DAC6] shadow-xs">
          <span className="text-xs text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <PackageCheck className="w-4 h-4 text-[#c05b3f]" />
            {lang === "hi" ? "हैंडमेड उत्पाद बेचे" : "Handmade Units Sold"}
          </span>
          <p className="text-2xl font-black text-[#201610]">
            {totalUnitsSold} <span className="text-xs font-semibold text-[#785E4B]">units</span>
          </p>
          <span className="text-[11px] font-bold text-indigo-700 mt-1 block">
            Handmade Baskets
          </span>
        </div>

        {/* 3. Verified Deals */}
        <div className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#E9DAC6] shadow-xs">
          <span className="text-xs text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            {lang === "hi" ? "सत्यापित सौदे / Deals" : "Deals Closed"}
          </span>
          <p className="text-2xl font-black text-emerald-950">
            {dealsCount}
          </p>
          <span className="text-[11px] font-bold text-emerald-700 mt-1 block">
            With ABC Handicrafts
          </span>
        </div>

        {/* 4. Support Cases */}
        <div className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#E9DAC6] shadow-xs">
          <span className="text-xs text-[#785E4B] font-semibold flex items-center gap-1.5 mb-1">
            <HeartHandshake className="w-4 h-4 text-indigoCraft" />
            {lang === "hi" ? "एनजीओ केस / Support" : "Support Cases"}
          </span>
          <p className="text-2xl font-black text-indigo-950">
            {casesCount}
          </p>
          <span className="text-[11px] font-bold text-indigo-700 mt-1 block">
            ₹50,000 Micro-Grant Active
          </span>
        </div>
      </div>

      {/* Visual Earnings Chart Bar */}
      <div className="p-5 bg-[#FAF6F0] rounded-2xl border border-[#EADBCA] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#201610] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#c05b3f]" />
            {lang === "hi" ? "साप्ताहिक बिक्री एवं कमाई वृद्धि (Weekly Growth Trend)" : "Weekly Revenue Growth with Voice AI"}
          </h4>
          <span className="text-xs font-bold text-[#c05b3f] bg-orange-100 px-2.5 py-0.5 rounded-full">
            ₹205 / unit Peak Rate
          </span>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2">
          {weeklyData.map((d, idx) => {
            const heightPercent = Math.round((d.amount / maxAmount) * 100);
            const isToday = idx === weeklyData.length - 1;

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-extrabold text-[#785E4B] group-hover:text-[#c05b3f] transition-colors">
                  ₹{(d.amount / 1000).toFixed(1)}k
                </span>
                <div className="w-full bg-[#E5D7C3] rounded-t-xl overflow-hidden h-24 flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      isToday
                        ? "bg-gradient-to-t from-[#c05b3f] to-[#f59e0b] shadow-md animate-pulse"
                        : "bg-[#C4AD97] group-hover:bg-[#c05b3f]"
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-bold ${isToday ? "text-[#c05b3f]" : "text-[#785E4B]"}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Case File #CASE-SKH Tracker */}
      <div className="p-5 bg-[#FFFDF9] rounded-2xl border border-[#E9DAC6] space-y-3">
        <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-2.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-700" />
            <h4 className="font-bold text-sm text-[#201610]">
              {lang === "hi" ? "सक्रिय एनजीओ सहायता फ़ाइल (#CASE-SKH)" : "Active NGO Escalation File (#CASE-SKH)"}
            </h4>
          </div>
          <span className="text-[10px] font-mono font-extrabold bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-md">
            #CASE-SKH-8291
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#ECE0CF]">
            <span className="text-[11px] text-[#785E4B] font-semibold block">Counselor Assigned</span>
            <span className="font-bold text-[#201610]">Priya Sharma (Sakhi Foundation)</span>
          </div>
          <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#ECE0CF]">
            <span className="text-[11px] text-[#785E4B] font-semibold block">Handover Mode</span>
            <span className="font-bold text-emerald-800">Zero-Repetition Audio Summary</span>
          </div>
          <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#ECE0CF]">
            <span className="text-[11px] text-[#785E4B] font-semibold block">Grant Application</span>
            <span className="font-bold text-[#c05b3f]">₹50,000 Capacity Expansion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
