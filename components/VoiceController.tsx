"use client";

import React from "react";
import { Mic, Radio, Loader2, Square, Sparkles, AlertCircle } from "lucide-react";
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
  isAgoraConnected,
}) => {
  const isListening = voiceState === "LISTENING";
  const isSpeaking = voiceState === "SPEAKING";
  const isThinking = voiceState === "THINKING";
  const isToolCalling = voiceState === "TOOL_CALLING";
  const isEscalating = voiceState === "ESCALATING";

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Dynamic Status Capsule */}
      <div className="mb-4">
        {isListening && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-bold border border-emerald-300 shadow-sm animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            {lang === "hi" ? "सखी सुन रही है (Agora Live)..." : "Sakhi is Listening (Agora Live)..."}
          </span>
        )}
        {isThinking && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs sm:text-sm font-bold border border-amber-300 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
            {lang === "hi" ? "सखी समझ रही है..." : "Sakhi is reasoning..."}
          </span>
        )}
        {isSpeaking && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-950 text-xs sm:text-sm font-bold border border-orange-300 shadow-sm">
            <Radio className="w-4 h-4 animate-pulse text-orange-600" />
            {lang === "hi" ? "सखी बोल रही है (Agora Voice AI)" : "Sakhi is Speaking (Agora Voice AI)"}
          </span>
        )}
        {isToolCalling && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-950 text-xs sm:text-sm font-bold border border-indigo-300 shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
            {lang === "hi" ? "मार्केट / मंडी डेटा टूल चल रहा है..." : "Executing external data tool..."}
          </span>
        )}
        {isEscalating && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-950 text-xs sm:text-sm font-bold border border-purple-300 shadow-sm">
            <Radio className="w-4 h-4 text-purple-700" />
            {lang === "hi" ? "काउंसलर से केस कनेक्ट हो रहा है..." : "Connecting with human counselor..."}
          </span>
        )}
        {voiceState === "IDLE" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE3D3] text-[#553822] text-xs sm:text-sm font-semibold border border-[#DECDBC]">
            <Mic className="w-4 h-4 text-terracotta" />
            {lang === "hi" ? "माइक दबाकर बात शुरू करें" : "Tap the Mic to Speak in Hindi / Hinglish"}
          </span>
        )}
      </div>

      {/* Central Tactile Microphone Hero Orb */}
      <div className="relative flex items-center justify-center my-2">
        {/* Animated Ripple Waves */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-emerald-500/20 ripple-speech-1 pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full bg-emerald-500/10 ripple-speech-2 pointer-events-none" />
          </>
        )}
        {isSpeaking && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-marigold/30 ripple-speech-1 pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full bg-terracotta/20 ripple-speech-2 pointer-events-none" />
          </>
        )}

        {/* Big Tactile Craft Button */}
        <button
          id="main-mic-button"
          onClick={onToggleMic}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white transition-all btn-craft select-none cursor-pointer ${
            isListening
              ? "bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 ring-4 ring-emerald-300 shadow-emerald-700/30"
              : isSpeaking
              ? "bg-gradient-to-tr from-terracotta via-marigold to-terracotta-dark ring-4 ring-orange-300 animate-pulse shadow-terracotta/40"
              : isThinking || isToolCalling
              ? "bg-gradient-to-tr from-amber-600 to-amber-700 ring-4 ring-amber-300 shadow-amber-800/30"
              : "bg-gradient-to-tr from-terracotta via-[#D95F30] to-terracotta-dark ring-4 ring-[#F2DFC9] animate-orb-breathe shadow-terracotta/30"
          }`}
          aria-label="Toggle Sakhi Voice"
        >
          {isListening ? (
            <>
              <Mic className="w-10 h-10 sm:w-11 sm:h-11 animate-bounce" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Tap to Stop</span>
            </>
          ) : isSpeaking ? (
            <>
              <Radio className="w-10 h-10 sm:w-11 sm:h-11 animate-spin" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Speaking</span>
            </>
          ) : isThinking ? (
            <>
              <Loader2 className="w-10 h-10 sm:w-11 sm:h-11 animate-spin" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Thinking</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10 sm:w-11 sm:h-11" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">बोलिए / Speak</span>
            </>
          )}
        </button>
      </div>

      {/* Barge-in / Interrupt Action Pill (Active when Sakhi is speaking) */}
      {isSpeaking && (
        <div className="mt-3 animate-fade-in">
          <button
            onClick={onInterrupt}
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white font-bold text-xs rounded-full shadow-lg shadow-rose-900/20 transition-all border border-rose-600 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{lang === "hi" ? "रुको / Interrupt Sakhi (Barge-in)" : "Barge-in / Interrupt Sakhi"}</span>
          </button>
        </div>
      )}

      {/* Real-time Web Audio Visualizer */}
      <div className="w-full max-w-sm my-3.5">
        <AudioWaveform
          isActive={isListening || isSpeaking || isThinking}
          isSpeaking={isSpeaking}
          isListening={isListening}
          volumeLevel={volumeLevel}
        />
      </div>

      {/* Live Speech Subtitle Bubble */}
      <div className="w-full max-w-xl min-h-[48px] flex items-center justify-center p-3 rounded-2xl bg-[#F7EFE3] border border-[#E5D7C2] shadow-sm">
        <p className="text-xs sm:text-sm font-semibold text-[#301E11] italic leading-relaxed">
          {currentSpeechText ? (
            `"${currentSpeechText}"`
          ) : (
            <span className="text-[#836952] not-italic font-normal">
              {lang === "hi"
                ? "माइक दबाकर अपनी बात बोलें, या नीचे दिए गए क्विक टेस्ट बटनों पर क्लिक करें..."
                : "Tap the mic to talk, or click any demo prompt chip below..."}
            </span>
          )}
        </p>
      </div>

      {/* Quick Test Voice Chips for Judges & Demo */}
      <div className="mt-5 w-full text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6D4C33] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            {lang === "hi" ? "त्वरित आवाज़ टेस्ट (Quick Voice Input Chips)" : "Demo Voice Prompt Triggers"}
          </span>
          <span className="text-[11px] text-[#8E735D] font-medium hidden sm:inline">
            Click to simulate voice input directly
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onTriggerPresetUtterance(
                "Mere paas 100 handmade baskets hain aur mujhe bechna hai."
              )
            }
            className="text-xs font-medium px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3C2615] rounded-xl border border-[#DECDB8] shadow-sm transition-all cursor-pointer"
          >
            💬 "Mere paas 100 handmade baskets hain..."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Bulk mein.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3C2615] rounded-xl border border-[#DECDB8] shadow-sm transition-all cursor-pointer"
          >
            💬 "Bulk mein."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Greater Noida.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3C2615] rounded-xl border border-[#DECDB8] shadow-sm transition-all cursor-pointer"
          >
            📍 "Greater Noida."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Haan, market rate check karo.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3C2615] rounded-xl border border-[#DECDB8] shadow-sm transition-all cursor-pointer"
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
            className="text-xs font-bold px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-xl border border-amber-300 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            ⚡ "Actually mere paas 150 baskets hain" <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Barge-in</span>
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Haan, buyer se baat karwao.")}
            className="text-xs font-medium px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3C2615] rounded-xl border border-[#DECDB8] shadow-sm transition-all cursor-pointer"
          >
            🤝 "Buyer se baat karwao"
          </button>

          <button
            onClick={() =>
              onTriggerPresetUtterance(
                "Mujhe business ke liye loan chahiye."
              )
            }
            className="text-xs font-medium px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3C2615] rounded-xl border border-[#DECDB8] shadow-sm transition-all cursor-pointer"
          >
            🏛️ "Mujhe business ke liye loan chahiye"
          </button>
        </div>
      </div>
    </div>
  );
};
