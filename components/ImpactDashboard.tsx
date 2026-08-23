"use client";

import React from "react";
import { TrendingUp, PackageCheck, DollarSign, Users, Award, FileText, ArrowUpRight, CheckCircle2, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { RECORDED_DEALS, RECORDED_CASES } from "@/lib/agent/tools";

interface ImpactDashboardProps {
  lang: "hi" | "en";
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ lang }) => {
  const totalRevenue = RECORDED_DEALS.reduce((acc, curr) => acc + curr.totalValue, 0) || 30750;
  const totalUnitsSold = RECORDED_DEALS.reduce((acc, curr) => acc + curr.quantity, 0) || 150;
  const dealsCount = RECORDED_DEALS.length || 1;
  const casesCount = RECORDED_CASES.length || 1;

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
    <div className="bg-zinc-950 rounded-5xl p-6 lg:p-10 border border-white/10 shadow-2xl text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xl lg:text-2xl tracking-tight">
              {lang === "hi" ? "उद्यमी प्रभाव एवं कमाई डैशबोर्ड" : "Rural Artisan Impact & Earnings System"}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {lang === "hi"
                ? "सखी वॉयस एजेंट द्वारा बंद किए गए सौदे, कुल कमाई और एनजीओ अनुदान स्थिति"
                : "Real-time earnings, closed bulk orders, and financial empowerment tracking"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold w-fit shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          100% Direct to Artisan Account
        </span>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Earnings */}
        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            {lang === "hi" ? "कुल कमाई / Revenue" : "Total Revenue"}
          </span>
          <p className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-bold text-emerald-400 mt-1.5 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +100% via Voice AI
          </span>
        </div>

        {/* 2. Units Sold */}
        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1.5">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            {lang === "hi" ? "हैंडमेड उत्पाद बेचे" : "Handmade Units Sold"}
          </span>
          <p className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            {totalUnitsSold} <span className="text-xs font-semibold text-zinc-400">units</span>
          </p>
          <span className="text-[11px] font-semibold text-zinc-400 mt-1.5 block">
            Handmade Baskets
          </span>
        </div>

        {/* 3. Verified Deals */}
        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {lang === "hi" ? "सत्यापित सौदे / Deals" : "Deals Closed"}
          </span>
          <p className="text-2xl lg:text-3xl font-black text-emerald-400 tracking-tight">
            {dealsCount}
          </p>
          <span className="text-[11px] font-semibold text-zinc-400 mt-1.5 block">
            With ABC Handicrafts
          </span>
        </div>

        {/* 4. Support Cases */}
        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 mb-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            {lang === "hi" ? "एनजीओ केस / Support" : "Support Cases"}
          </span>
          <p className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            {casesCount}
          </p>
          <span className="text-[11px] font-semibold text-emerald-400 mt-1.5 block">
            ₹50,000 Micro-Grant Active
          </span>
        </div>
      </div>

      {/* Visual Earnings Chart Bar */}
      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            {lang === "hi" ? "साप्ताहिक बिक्री एवं कमाई वृद्धि (Weekly Growth Trend)" : "Weekly Revenue Growth with Voice AI"}
          </h4>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            ₹205 / unit Peak Rate
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
          {weeklyData.map((d, idx) => {
            const heightPercent = Math.round((d.amount / maxAmount) * 100);
            const isToday = idx === weeklyData.length - 1;

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  ₹{(d.amount / 1000).toFixed(1)}k
                </span>
                <div className="w-full bg-white/5 rounded-t-xl overflow-hidden h-28 flex items-end border border-white/10">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      isToday
                        ? "bg-emerald-400 shadow-emerald-glow animate-pulse"
                        : "bg-zinc-700 group-hover:bg-emerald-500"
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-semibold ${isToday ? "text-emerald-400 font-bold" : "text-zinc-500"}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Case File #CASE-SKH Tracker */}
      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">
              {lang === "hi" ? "सक्रिय एनजीओ सहायता फ़ाइल (#CASE-SKH)" : "Active NGO Escalation File (#CASE-SKH)"}
            </h4>
          </div>
          <span className="text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            #CASE-SKH-8291
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Counselor Assigned</span>
            <span className="font-bold text-white">Priya Sharma (Sakhi Foundation)</span>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Handover Mode</span>
            <span className="font-bold text-emerald-400">Zero-Repetition Audio Summary</span>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Grant Application</span>
            <span className="font-bold text-white">₹50,000 Capacity Expansion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
