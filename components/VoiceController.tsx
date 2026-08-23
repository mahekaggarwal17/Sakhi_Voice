"use client";

import React from "react";
import { Mic, MicOff, Square, Radio, Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

export type AgentVoiceState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING" | "TOOL_CALLING" | "ESCALATING";

interface VoiceControllerProps {
  voiceState: AgentVoiceState;
  onToggleMic: () => void;
  onInterrupt: () => void;
  volumeLevel: number;
  currentSpeechText: string;
  onTriggerPresetUtterance: (text: string, isInterruption?: boolean) => void;
  lang: "hi" | "en";
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  voiceState,
  onToggleMic,
  onInterrupt,
  volumeLevel,
  currentSpeechText,
  onTriggerPresetUtterance,
  lang,
}) => {
  const isListening = voiceState === "LISTENING";
  const isSpeaking = voiceState === "SPEAKING";
  const isThinking = voiceState === "THINKING";
  const isToolCalling = voiceState === "TOOL_CALLING";

  return (
    <div className="bg-gradient-to-b from-white to-[#FBF7F0] rounded-3xl border-2 border-[#E9DCBE] p-6 lg:p-8 shadow-xl shadow-orange-950/5 flex flex-col items-center text-center relative overflow-hidden">
      {/* Background Decorative Subtle Rings */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Voice Status Pill */}
      <div className="mb-5 flex items-center justify-center">
        {voiceState === "LISTENING" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold border border-emerald-300 shadow-sm animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            {lang === "hi" ? "सुन रही हूँ... आप बोलिए" : "Listening... Please speak naturally"}
          </span>
        )}
        {voiceState === "THINKING" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold border border-amber-300 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            {lang === "hi" ? "सखी सोच रही है..." : "Sakhi is processing..."}
          </span>
        )}
        {voiceState === "SPEAKING" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-900 text-sm font-bold border border-orange-300 shadow-sm">
            <Radio className="w-4 h-4 animate-pulse text-orange-600" />
            {lang === "hi" ? "सखी बोल रही है (Agora Voice AI)" : "Sakhi is Speaking (Agora Voice AI)"}
          </span>
        )}
        {voiceState === "TOOL_CALLING" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-900 text-sm font-bold border border-purple-300 shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
            {lang === "hi" ? "डेटाबेस / मंडी टूल से जानकारी आ रही है..." : "Executing external data tool..."}
          </span>
        )}
        {voiceState === "ESCALATING" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 text-sm font-bold border border-blue-300 shadow-sm animate-bounce">
            <Radio className="w-4 h-4 text-blue-600" />
            {lang === "hi" ? "एनजीओ सपोर्ट केस तैयार हो रहा है..." : "Creating structured NGO escalation case..."}
          </span>
        )}
        {voiceState === "IDLE" && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE6D8] text-[#5A4532] text-sm font-semibold border border-[#DDCBB5]">
            <Mic className="w-4 h-4 text-orange-600" />
            {lang === "hi" ? "माइक दबाकर बात शुरू करें" : "Tap the Mic to Start Speaking"}
          </span>
        )}
      </div>

      {/* Central Tactile Microphone Orb */}
      <div className="relative flex items-center justify-center my-3">
        {/* Ripple Rings when listening or speaking */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-emerald-400/25 ripple-ring-1 pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 ripple-ring-2 pointer-events-none" />
          </>
        )}
        {isSpeaking && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-orange-400/30 ripple-ring-1 pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full bg-orange-500/20 ripple-ring-2 pointer-events-none" />
          </>
        )}

        {/* Big Mic Button */}
        <button
          onClick={onToggleMic}
          className={`relative z-10 w-28 h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center text-white transition-all btn-tactile ${
            isListening
              ? "bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/40 ring-4 ring-emerald-300"
              : isSpeaking
              ? "bg-gradient-to-tr from-orange-600 to-amber-500 shadow-lg shadow-orange-600/40 ring-4 ring-orange-300 animate-pulse"
              : isThinking || isToolCalling
              ? "bg-gradient-to-tr from-amber-600 to-yellow-500 ring-4 ring-amber-300"
              : "bg-gradient-to-tr from-orange-600 via-amber-600 to-orange-500 hover:scale-105 shadow-xl shadow-orange-700/30 ring-4 ring-[#F3E5D0]"
          }`}
          aria-label="Toggle Agora Voice Agent"
        >
          {isListening ? (
            <>
              <Mic className="w-10 h-10 lg:w-12 lg:h-12 animate-bounce" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Tap to Stop</span>
            </>
          ) : isSpeaking ? (
            <>
              <Radio className="w-10 h-10 lg:w-12 lg:h-12 animate-spin" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Speaking</span>
            </>
          ) : isThinking ? (
            <>
              <Loader2 className="w-10 h-10 lg:w-12 lg:h-12 animate-spin" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Thinking</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10 lg:w-12 lg:h-12" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">बोलिए / Speak</span>
            </>
          )}
        </button>
      </div>

      {/* Speech Interruption / Barge-in Button (Active when AI is speaking) */}
      {isSpeaking && (
        <div className="mt-3 animate-fade-in">
          <button
            onClick={onInterrupt}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-full shadow-md shadow-red-600/30 transition-all border border-red-500"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{lang === "hi" ? "रुको / Interrupt AI" : "Barge-in / Interrupt AI"}</span>
          </button>
        </div>
      )}

      {/* Audio Frequency Waveform Visualizer */}
      <div className="w-full max-w-sm my-4">
        <AudioWaveform
          isActive={isListening || isSpeaking || isThinking}
          isSpeaking={isSpeaking}
          isListening={isListening}
          volumeLevel={volumeLevel}
        />
      </div>

      {/* Real-time Subtitle / Spoken Feedback */}
      <div className="w-full max-w-xl min-h-[50px] flex items-center justify-center p-3 rounded-2xl bg-[#F6F0E7] border border-[#E4D5C2]">
        <p className="text-sm lg:text-base font-semibold text-[#2C1F15] italic leading-relaxed">
          {currentSpeechText ? (
            `"${currentSpeechText}"`
          ) : (
            <span className="text-[#88705B] not-italic font-normal">
              {lang === "hi"
                ? "माइक दबाकर अपनी भाषा (हिंदी + इंग्लिश) में बोलें..."
                : "Tap the mic and speak naturally in Hindi or Hinglish..."}
            </span>
          )}
        </p>
      </div>

      {/* Quick Test Voice Chips for Demo & Rapid Interaction */}
      <div className="mt-5 w-full text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6F553F] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-600" />
            {lang === "hi" ? "त्वरित आवाज़ टेस्ट (Quick Voice Input Chips)" : "Demo Voice Prompt Triggers"}
          </span>
          <span className="text-[11px] text-[#917965] font-medium hidden sm:inline">
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
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3F2E1E] rounded-xl border border-[#DECDB8] shadow-sm transition-all"
          >
            💬 "Mere paas 100 handmade baskets hain..."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Bulk mein.")}
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3F2E1E] rounded-xl border border-[#DECDB8] shadow-sm transition-all"
          >
            💬 "Bulk mein."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Greater Noida.")}
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3F2E1E] rounded-xl border border-[#DECDB8] shadow-sm transition-all"
          >
            📍 "Greater Noida."
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Haan, market rate check karo.")}
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3F2E1E] rounded-xl border border-[#DECDB8] shadow-sm transition-all"
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
            className="text-xs font-bold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-300 shadow-sm transition-all flex items-center gap-1"
          >
            ⚡ "Actually mere paas 150 baskets hain" <span className="text-[10px] bg-amber-200 text-amber-800 px-1 rounded">Barge-in</span>
          </button>

          <button
            onClick={() => onTriggerPresetUtterance("Haan, buyer se baat karwao.")}
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3F2E1E] rounded-xl border border-[#DECDB8] shadow-sm transition-all"
          >
            🤝 "Buyer se baat karwao"
          </button>

          <button
            onClick={() =>
              onTriggerPresetUtterance(
                "Mujhe business ke liye loan chahiye."
              )
            }
            className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-[#3F2E1E] rounded-xl border border-[#DECDB8] shadow-sm transition-all"
          >
            🏛️ "Mujhe business ke liye loan chahiye"
          </button>
        </div>
      </div>
    </div>
  );
};
