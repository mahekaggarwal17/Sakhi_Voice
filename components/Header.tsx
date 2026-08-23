"use client";

import React from "react";
import { Mic, Radio, Sparkles, RefreshCw, Volume2, ShieldCheck, HeartHandshake } from "lucide-react";

interface HeaderProps {
  agoraConnected: boolean;
  onResetSession: () => void;
  onOpenDemoGuide: () => void;
  lang: "hi" | "en";
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  agoraConnected,
  onResetSession,
  onOpenDemoGuide,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DCcb] px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-terracotta to-marigold flex items-center justify-center text-white shadow-md shadow-terracotta/25 border border-white/20">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#25170C]">
                Sakhi Voice <span className="text-terracotta font-black">(सखी वॉयस)</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-orange-100/90 text-terracotta px-2.5 py-0.5 rounded-full border border-orange-200 shadow-xs">
                <Sparkles className="w-3 h-3 text-terracotta" />
                Rural Business AI
              </span>
            </div>
            <p className="text-xs text-[#755D4A] font-semibold hidden md:block">
              {lang === "hi"
                ? "ग्रामीण महिला उद्यमियों के लिए वॉयस-फर्स्ट बिज़नेस साथी"
                : "Voice-First Conversational Business Agent for Rural Women Entrepreneurs"}
            </p>
          </div>
        </div>

        {/* Live Agora & Demo Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Agora RTC Engine Status Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5D7C3] shadow-xs text-xs font-bold">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                agoraConnected ? "bg-emerald-500 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span className="text-[#3F2B1D] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-terracotta" />
              <span className="hidden sm:inline">Agora Voice Engine:</span>
              <strong className="text-emerald-800 font-extrabold">Active</strong>
            </span>
          </div>

          {/* 9-Step Demo Walkthrough Guide Button */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-terracotta to-marigold hover:from-terracotta-dark hover:to-[#B03E19] text-white text-xs font-bold rounded-full shadow-tactile transition-all btn-craft cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden md:inline">Judge</span> Demo Guide
          </button>

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            className="px-3.5 py-2 bg-[#EFE5D6] hover:bg-[#E4D7C3] text-[#3A2413] text-xs font-bold rounded-full transition-colors border border-[#DDD0BC] cursor-pointer shadow-xs"
            title="Toggle Language Display"
          >
            {lang === "hi" ? "EN / हिं" : "हिं / EN"}
          </button>

          {/* Reset Session */}
          <button
            onClick={onResetSession}
            className="p-2 rounded-full text-[#7B624E] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
