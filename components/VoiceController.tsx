"use client";

import React from "react";
import { Mic, Radio, Loader2, Square, Sparkles, AlertCircle, Volume2, ArrowRight } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

export type AgentVoiceState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING" | "TOOL_CALLING" | "ESCALATING";

interface VoiceControllerProps {
  voiceState: AgentVoiceState;
  onToggleMic: () => void;
  onInterrupt: () => void;
  currentSpeechText: string;
  volumeLevel: number;
  lang: "hi" | "en";
  onTriggerPresetUtterance: (text: string, isInterruption?: boolean) => void;
  isAgoraConnected?: boolean;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  voiceState,
  onToggleMic,
  onInterrupt,
  currentSpeechText,
  volumeLevel,
  lang,
  onTriggerPresetUtterance,
  isAgoraConnected = true,
}) => {
  const isListening = voiceState === "LISTENING";
  const isSpeaking = voiceState === "SPEAKING";
  const isThinking = voiceState === "THINKING";
  const isToolCalling = voiceState === "TOOL_CALLING";
  const isEscalating = voiceState === "ESCALATING";

  const scaleBoost = isListening || isSpeaking ? 1 + (volumeLevel / 100) * 0.15 : 1;

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Active State Pill */}
      <div className="mb-4">
        {isListening && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 shadow-emerald-glow animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {lang === "hi" ? "सखी सुन रही है (Agora Voice Live)..." : "Sakhi is Listening (Agora Live)..."}
          </span>
        )}
        {isThinking && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            {lang === "hi" ? "सखी सोच रही है (Reasoning Engine)..." : "Sakhi is reasoning..."}
          </span>
        )}
        {isSpeaking && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 shadow-emerald-glow">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            {lang === "hi" ? "सखी बोल रही है (Agora Voice AI)" : "Sakhi is Speaking (Agora Voice AI)"}
          </span>
        )}
        {isToolCalling && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            {lang === "hi" ? "मंडी रेट टूल सक्रिय..." : "Executing external data tool..."}
          </span>
        )}
        {isEscalating && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 text-purple-300 text-xs font-bold border border-purple-500/40">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            {lang === "hi" ? "काउंसलर से केस कनेक्ट हो रहा है..." : "Connecting with human counselor..."}
          </span>
        )}
        {voiceState === "IDLE" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-zinc-400 text-xs font-medium border border-white/10">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            {lang === "hi" ? "माइक दबाकर बात शुरू करें (Zero-Typing)" : "Tap the Glass Orb to Speak in Hinglish"}
          </span>
        )}
      </div>

      {/* Central Hero: Glass Voice Orb */}
      <div className="relative flex items-center justify-center my-3">
        {/* Dynamic Glowing Rings */}
        <div
          className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full pointer-events-none transition-opacity duration-500 ${
            isListening || isSpeaking ? "opacity-100" : "opacity-30"
          }`}
        >
          <div className="w-full h-full rounded-full border border-emerald-500/30 animate-ping opacity-25" />
        </div>

        {isListening && (
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-emerald-500/15 filter blur-xl animate-pulse pointer-events-none" />
        )}
        {isSpeaking && (
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-emerald-400/20 filter blur-xl animate-pulse pointer-events-none" />
        )}

        {/* The Glass Orb Button */}
        <button
          id="main-mic-button"
          onClick={onToggleMic}
          style={{ transform: `scale(${scaleBoost})` }}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            isListening
              ? "bg-emerald-500 text-zinc-950 shadow-emerald-glow ring-4 ring-emerald-300"
              : isSpeaking
              ? "bg-zinc-900 text-emerald-400 border border-emerald-500/50 shadow-emerald-glow ring-4 ring-emerald-500/30 animate-pulse"
              : isThinking || isToolCalling
              ? "bg-zinc-900 text-amber-400 border border-amber-500/50 ring-4 ring-amber-500/20"
              : "bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-xl shadow-glass hover:scale-105"
          }`}
          aria-label="Toggle Sakhi Voice"
        >
          {isListening ? (
            <>
              <Mic className="w-10 h-10 animate-bounce text-zinc-950" />
              <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-zinc-950">Listening</span>
            </>
          ) : isSpeaking ? (
            <>
              <Radio className="w-10 h-10 animate-spin text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-emerald-400">Speaking</span>
            </>
          ) : isThinking ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-amber-400">Thinking</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10 text-white drop-shadow-md" />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-white/90">बोलिए / Speak</span>
            </>
          )}
        </button>
      </div>

      {/* Barge-in / Interruption Button */}
      {isSpeaking && (
        <div className="mt-3 animate-fade-in-up">
          <button
            onClick={onInterrupt}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-full shadow-lg shadow-rose-950/50 transition-all border border-rose-400/50 cursor-pointer"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>{lang === "hi" ? "रुको / Interrupt (Barge-in)" : "Barge-in / Interrupt Sakhi"}</span>
          </button>
        </div>
      )}

      {/* Waveform Visualizer */}
      <div className="w-full max-w-sm my-3">
        <AudioWaveform
          isActive={isListening || isSpeaking || isThinking}
          isSpeaking={isSpeaking}
          isListening={isListening}
          volumeLevel={volumeLevel}
        />
      </div>

      {/* Live Speech Subtitle Card */}
      <div className="w-full max-w-xl min-h-[48px] flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
        <p className="text-xs sm:text-sm font-medium text-white/90 italic leading-relaxed">
          {currentSpeechText ? (
            `"${currentSpeechText}"`
          ) : (
            <span className="text-zinc-500 not-italic font-normal">
              {lang === "hi"
                ? "माइक दबाकर अपनी बात बोलें, या नीचे दिए गए त्वरित बटनों पर क्लिक करें..."
                : "Tap the Glass Orb to speak, or click any prompt trigger below..."}
            </span>
          )}
        </p>
      </div>

      {/* Quick Prompt Trigger Chips */}
      <div className="mt-5 w-full text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {lang === "hi" ? "त्वरित आवाज़ टेस्ट (Quick Voice Input Chips)" : "Demo Voice Prompt Triggers"}
          </span>
          <span className="text-[11px] text-zinc-500 font-medium hidden sm:inline">
            Click to simulate voice input
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onTriggerPresetUtterance(
                "Mere paas 100 handmade baskets hain aur mujhe bechna hai."
              )
            }
            className="text-xs font-medium px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-full border border-white/10 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            💬 "Mere paas 100 handmade baskets hain..."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Bulk mein.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-full border border-white/10 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            💬 "Bulk mein."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Greater Noida.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-full border border-white/10 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            📍 "Greater Noida."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Haan, market rate check karo.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-full border border-white/10 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            📊 "Haan, market rate check karo"
          </button>

          <button
            onClick={() =>
              onTriggerPresetUtterance(
                "Actually mere paas 150 baskets hain.",
                true // Barge-in interruption
              )
            }
            className="text-xs font-bold px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-full border border-emerald-500/40 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            ⚡ "Actually mere paas 150 baskets hain" <span className="text-[10px] bg-emerald-400 text-zinc-950 px-1.5 py-0.2 rounded-full font-black">Barge-in</span>
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Haan, buyer se baat karwao.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-full border border-white/10 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            🤝 "Buyer se baat karwao"
          </button>

          <button
            onClick={() =>
              onTriggerPresetUtterance(
                "Mujhe business ke liye loan chahiye."
              )
            }
            className="text-xs font-medium px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-full border border-white/10 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            🏛️ "Mujhe business ke liye loan chahiye"
          </button>
        </div>
      </div>
    </div>
  );
};
