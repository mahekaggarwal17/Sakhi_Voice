"use client";

import React from "react";
import { Mic, Radio, Sparkles, RefreshCw, Volume2, ShieldCheck, HeartHandshake, ArrowUpRight } from "lucide-react";

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
    <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full">
      {/* Floating Glass Navbar with 20px blur and rounded-full shape */}
      <div className="bg-black/60 backdrop-blur-[20px] border border-white/10 p-1.5 sm:px-6 sm:py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-3 text-white">
        {/* Brand & Live Agora Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Sakhi Voice <span className="text-emerald-400 font-extrabold">(सखी)</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Agora AI
              </span>
            </div>
          </div>
        </div>

        {/* Action Links & Demo Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Demo Guide Pill */}
          <button
            onClick={onOpenDemoGuide}
            className="px-4 py-1.5 bg-white text-zinc-950 font-bold text-xs rounded-full hover:scale-105 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Judge</span> 9-Step Demo
          </button>

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold tracking-wider transition-colors border border-white/10 cursor-pointer"
          >
            {lang === "hi" ? "EN / हिं" : "हिं / EN"}
          </button>

          {/* Reset */}
          <button
            onClick={onResetSession}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
