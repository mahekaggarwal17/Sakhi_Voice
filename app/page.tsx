"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { VoiceController, AgentVoiceState } from "@/components/VoiceController";
import { BusinessSnapshot } from "@/components/BusinessSnapshot";
import { ConversationTranscript, TranscriptTurn } from "@/components/ConversationTranscript";
import { ToolExecutionBadge } from "@/components/ToolExecutionBadge";
import { MarketIntelligenceCard } from "@/components/MarketIntelligenceCard";
import { BuyerDiscoveryList } from "@/components/BuyerDiscoveryList";
import { BuyerCallModal } from "@/components/BuyerCallModal";
import { DealConfirmModal } from "@/components/DealConfirmModal";
import { NgoSupportCard } from "@/components/NgoSupportCard";
import { CaseEscalationModal } from "@/components/CaseEscalationModal";
import { DemoScenarioGuide } from "@/components/DemoScenarioGuide";
import { INITIAL_BUSINESS_MEMORY, BusinessMemoryState } from "@/lib/agent/conversationState";
import { ToolExecutionResult, RECORDED_DEALS, RECORDED_CASES } from "@/lib/agent/tools";
import { BuyerProfile, SEED_BUYERS } from "@/lib/data/seedBuyers";
import { SupportOrganization, SupportCaseRecord, SEED_SUPPORT_ORGS } from "@/lib/data/seedSupport";
import { AgoraVoiceManager } from "@/lib/agora/rtcClient";
import { Sparkles, TrendingUp, Handshake, HeartHandshake, ShieldCheck } from "lucide-react";

export default function SakhiVoiceApp() {
  // State: Language & Agora Engine
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [agoraConnected, setAgoraConnected] = useState<boolean>(true);
  const [voiceState, setVoiceState] = useState<AgentVoiceState>("IDLE");
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [currentSpeechText, setCurrentSpeechText] = useState<string>("");

  // Business State & Transcript
  const [businessMemory, setBusinessMemory] = useState<BusinessMemoryState>(INITIAL_BUSINESS_MEMORY);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([
    {
      id: "intro-01",
      sender: "AI",
      textHindi: "Namaste! Main aapki business agent Sakhi hoon. Aap kya bechna chahti hain?",
      textEnglish: "Namaste! I am your business agent Sakhi. What product would you like to sell?",
      timestamp: "10:00 AM",
    },
  ]);

  // Active Tool & Modals
  const [lastExecutedTool, setLastExecutedTool] = useState<ToolExecutionResult | null>(null);
  const [activeBuyerCall, setActiveBuyerCall] = useState<BuyerProfile | null>(null);
  const [showDealConfirmModal, setShowDealConfirmModal] = useState<boolean>(false);
  const [pendingDealData, setPendingDealData] = useState<{ buyerName: string; organization: string; product: string; quantity: number; agreedPrice: number } | null>(null);
  const [activeEscalationCase, setActiveEscalationCase] = useState<SupportCaseRecord | null>(null);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(0);

  // Agora Voice Manager Ref
  const agoraManagerRef = useRef<AgoraVoiceManager | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Agora Voice Manager & Speech Engine
  useEffect(() => {
    agoraManagerRef.current = new AgoraVoiceManager();
    agoraManagerRef.current.onStateChange((state) => {
      setAgoraConnected(state.isConnected);
      if (state.audioVolume > 0) {
        setVolumeLevel(state.audioVolume);
      }
    });

    // Auto-connect to Agora Main Channel for hackathon demo
    agoraManagerRef.current.joinChannel("sakhi-main-channel").catch((e) => {
      console.log("Agora auto-channel joined in demo mode:", e);
    });

    return () => {
      agoraManagerRef.current?.leaveChannel();
    };
  }, []);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // High-Quality Natural Hindi Voice Speaker
  const speakText = (textHindiDevanagari: string, textFallback: string, onComplete?: () => void) => {
    if (typeof window === "undefined") {
      if (onComplete) onComplete();
      return;
    }

    // Stop any existing audio or speech
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setVoiceState("SPEAKING");

    // Tier 1: Natural High-Fidelity Hindi Audio Stream from /api/tts
    const textToStream = textHindiDevanagari || textFallback;
    const audioUrl = `/api/tts?text=${encodeURIComponent(textToStream)}&lang=${lang === "hi" ? "hi" : "en"}`;
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    audio.onplay = () => {
      setVoiceState("SPEAKING");
    };

    audio.onended = () => {
      setVoiceState("IDLE");
      currentAudioRef.current = null;
      if (onComplete) onComplete();
    };

    audio.onerror = (e) => {
      console.warn("Audio stream fallback to Web Speech Synthesis:", e);
      // Tier 2 Fallback: Browser Web Speech Synthesis with Indian Voice
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textHindiDevanagari || textFallback);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";

        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes("hi") ||
            v.lang.toLowerCase().includes("in") ||
            v.name.toLowerCase().includes("hindi") ||
            v.name.toLowerCase().includes("swara") ||
            v.name.toLowerCase().includes("heera") ||
            v.name.toLowerCase().includes("google हिन्दी")
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }

        utterance.onend = () => {
          setVoiceState("IDLE");
          if (onComplete) onComplete();
        };
        utterance.onerror = () => {
          setVoiceState("IDLE");
          if (onComplete) onComplete();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setVoiceState("IDLE");
        if (onComplete) onComplete();
      }
    };

    audio.play().catch((err) => {
      console.warn("Audio play blocked or failed, using SpeechSynthesis:", err);
      audio.onerror?.(new Event("error"));
    });
  };

  // Barge-in & Interruption Handler
  const handleInterrupt = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState("LISTENING");
    setCurrentSpeechText("Interrupted by user. Listening for your correction...");
  };

  // Main Conversational Turn Handler
  const handleProcessTurn = async (rawText: string, isInterruption: boolean = false) => {
    if (!rawText.trim()) return;

    // Add user turn to transcript
    const userTurn: TranscriptTurn = {
      id: `turn-${Date.now()}-user`,
      sender: "USER",
      textHindi: rawText,
      textEnglish: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isInterruption,
    };
    setTranscript((prev) => [...prev, userTurn]);
    setCurrentSpeechText(rawText);
    setVoiceState("THINKING");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: rawText,
          memory: businessMemory,
          isInterruption,
        }),
      });

      const data = await res.json();

      // Update structured state
      if (data.updatedMemory) {
        setBusinessMemory(data.updatedMemory);
      }

      // If tool was executed, show badge & set tool data
      if (data.executedTool) {
        setLastExecutedTool(data.executedTool);
        setVoiceState("TOOL_CALLING");
      }

      // Add AI turn to transcript
      const aiTurn: TranscriptTurn = {
        id: `turn-${Date.now()}-ai`,
        sender: "AI",
        textHindi: data.spokenTextHindi,
        textEnglish: data.spokenTextEnglish,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolTriggered: data.executedTool?.toolName,
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // Speak response aloud via High-Quality Hindi Voice
      const devanagariText = data.spokenTextDevanagari || data.spokenTextHindi;
      const fallbackText = lang === "hi" ? data.spokenTextHindi : data.spokenTextEnglish;
      speakText(devanagariText, fallbackText, () => {
        // Trigger any UI action after speaking
        if (data.actionTrigger === "OPEN_CALL_MODAL") {
          setActiveBuyerCall(SEED_BUYERS[0]);
        } else if (data.actionTrigger === "OPEN_ESCALATION_MODAL" && data.executedTool?.data) {
          setActiveEscalationCase(data.executedTool.data);
        }
      });
    } catch (err) {
      console.error("Failed to process conversational turn:", err);
      setVoiceState("IDLE");
    }
  };

  // Toggle Live Microphone via Web Speech Recognition & Agora
  const handleToggleMic = () => {
    if (voiceState === "LISTENING") {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn("Recognition stop error:", e);
        }
      }
      setVoiceState("IDLE");
      setCurrentSpeechText("");
      return;
    }

    if (voiceState === "SPEAKING") {
      handleInterrupt();
      return;
    }

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";

        recognition.onstart = () => {
          setVoiceState("LISTENING");
          setCurrentSpeechText("Listening... (बोलिए)");
        };

        recognition.onresult = (event: any) => {
          const transcriptText = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join("");
          setCurrentSpeechText(transcriptText);
          if (event.results[0].isFinal) {
            handleProcessTurn(transcriptText);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition notice/fallback:", e.error);
          if (e.error === "not-allowed" || e.error === "service-not-allowed") {
            setCurrentSpeechText("Microphone permission needed. You can also click the quick voice chips below!");
          }
          setVoiceState("IDLE");
        };

        recognition.onend = () => {
          setVoiceState((prev) => (prev === "LISTENING" ? "IDLE" : prev));
        };

        recognitionRef.current = recognition;
        recognition.start();
        setVoiceState("LISTENING");
        setCurrentSpeechText("Listening... (बोलिए)");
      } catch (err) {
        console.warn("Mic start caught error:", err);
        setVoiceState("IDLE");
      }
    } else {
      // Fallback speech simulation
      handleProcessTurn("Mere paas 100 handmade baskets hain aur mujhe bechna hai.");
    }
  };

  // 9-Step Winning Demo Execution
  const handleRunDemoStep = (stepNumber: number) => {
    setCurrentDemoStep(stepNumber);

    switch (stepNumber) {
      case 1:
        handleProcessTurn("Mere paas 100 handmade baskets hain aur mujhe bechna hai.");
        break;
      case 2:
        handleProcessTurn("Bulk mein. Greater Noida.");
        break;
      case 3:
        handleProcessTurn("Haan, market rate check karo.");
        break;
      case 4:
        handleProcessTurn("Actually mere paas 150 baskets hain.", true);
        break;
      case 5:
        handleProcessTurn("Haan, buyer se baat karwao.");
        break;
      case 6:
        setActiveBuyerCall(SEED_BUYERS[0]);
        break;
      case 7:
        setPendingDealData({
          buyerName: "Rajesh Sharma",
          organization: "ABC Handicrafts",
          product: "Handmade Baskets",
          quantity: businessMemory.quantity || 150,
          agreedPrice: 205,
        });
        setShowDealConfirmModal(true);
        break;
      case 8:
        handleProcessTurn("Mujhe business ke liye loan chahiye.");
        break;
      case 9:
        handleProcessTurn("Counselor se connect karo.");
        break;
      default:
        break;
    }
  };

  // Handle Deal Finalization from Modal
  const handleConfirmDeal = async () => {
    if (!pendingDealData) return;

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: "buyer-abc-01",
          product: pendingDealData.product,
          quantity: pendingDealData.quantity,
          agreedPrice: pendingDealData.agreedPrice,
          confirmedByUser: true,
        }),
      });
      const dealResult = await res.json();
      setLastExecutedTool(dealResult);

      const updatedMem: BusinessMemoryState = {
        ...businessMemory,
        activeNegotiation: {
          ...businessMemory.activeNegotiation,
          status: "CONFIRMED",
          agreedFinalPrice: pendingDealData.agreedPrice,
        },
      };
      setBusinessMemory(updatedMem);
      setShowDealConfirmModal(false);

      const aiTurn: TranscriptTurn = {
        id: `turn-${Date.now()}-ai`,
        sender: "AI",
        textHindi: `Badhaai ho! Deal ID ${dealResult.data?.dealId || "DEAL-9182"} database mein confirm ho gayi hai. Kya aap business expand karne ke liye financial support dekhna chahti hain?`,
        textEnglish: `Congratulations! Deal #${dealResult.data?.dealId || "DEAL-9182"} finalized and saved. Would you like to explore business expansion support?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolTriggered: "createDeal",
      };
      setTranscript((prev) => [...prev, aiTurn]);
      const hindiDevanagari = `बधाई हो! सौदा क्रमांक ${dealResult.data?.dealId || "DEAL-9182"} डेटाबेस में दर्ज हो गया है। क्या आप बिज़नेस बढ़ाने के लिए वित्तीय सहायता देखना चाहती हैं?`;
      speakText(hindiDevanagari, lang === "hi" ? aiTurn.textHindi : aiTurn.textEnglish);
    } catch (e) {
      console.error("Deal confirmation error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col">
      {/* Brand Header */}
      <Header
        agoraConnected={agoraConnected}
        onResetSession={() => {
          setBusinessMemory(INITIAL_BUSINESS_MEMORY);
          setLastExecutedTool(null);
          setTranscript([
            {
              id: "intro-reset",
              sender: "AI",
              textHindi: "Namaste! Main aapki business agent Sakhi hoon. Batayein, aaj hum kya bechein?",
              textEnglish: "Namaste! I am your business agent Sakhi. Tell me, what product shall we work on today?",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === "hi" ? "en" : "hi"))}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1 flex flex-col gap-6">
        {/* Top Hero: Voice-First Philosophy Banner */}
        <div className="bg-gradient-to-r from-[#2B1B10] via-[#3E2414] to-[#24150C] text-white rounded-3xl p-5 lg:p-6 shadow-xl shadow-[#2B1B10]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#52331E]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-400/30 shadow-xs">
                Agora Conversational AI Core
              </span>
              <span className="text-xs text-orange-200 font-semibold">
                AI for Rural Women Entrepreneurs & Artisans
              </span>
            </div>
            <h2 className="text-lg lg:text-2xl font-black tracking-tight text-white">
              "Don't make rural women learn complicated apps. Let them simply talk."
            </h2>
            <p className="text-xs lg:text-sm text-orange-100/90 max-w-2xl font-normal leading-relaxed">
              {lang === "hi"
                ? "प्राकृतिक भाषा (हिंग्लिश), बिना टाइप किए मंडी दर, थोक खरीदार खोज, लाइव मोलभाव और एनजीओ सहायता।"
                : "Zero-typing voice workflows for product intake, market pricing, live negotiation & NGO escalation."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDemoGuide(true)}
              className="px-5 py-3 bg-gradient-to-r from-terracotta to-marigold hover:from-terracotta-dark hover:to-[#A83814] text-white font-bold text-xs rounded-2xl shadow-tactile transition-all btn-craft cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Judge 9-Step Demo Guide</span>
            </button>
          </div>
        </div>

        {/* Primary Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Voice Agent Controller + Business Snapshot */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* 1. Voice Controller Hub */}
            <VoiceController
              voiceState={voiceState}
              onToggleMic={handleToggleMic}
              onInterrupt={handleInterrupt}
              volumeLevel={volumeLevel}
              currentSpeechText={currentSpeechText}
              onTriggerPresetUtterance={(text, isInterruption) =>
                handleProcessTurn(text, isInterruption)
              }
              lang={lang}
            />

            {/* 2. Real-time Tool Execution Feedback Badge */}
            {lastExecutedTool && (
              <ToolExecutionBadge toolResult={lastExecutedTool} lang={lang} />
            )}

            {/* 3. Business Memory / Snapshot HUD */}
            <BusinessSnapshot memory={businessMemory} lang={lang} />
          </div>

          {/* Right Column: Live Transcript + Context Cards */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* 1. Live Dialogue Transcript */}
            <ConversationTranscript transcript={transcript} lang={lang} />

            {/* 2. Contextual Tool Results Card based on Conversation Phase */}
            {businessMemory.conversationPhase === "MARKET_CHECK" && businessMemory.marketPriceRange && (
              <MarketIntelligenceCard
                data={{
                  id: "market-data-active",
                  product: businessMemory.product || "Handmade Basket",
                  aliases: [],
                  category: "handicraft",
                  minPrice: businessMemory.marketPriceRange.min,
                  maxPrice: businessMemory.marketPriceRange.max,
                  suggestedNegotiationStart: businessMemory.marketPriceRange.suggested,
                  unit: "per basket",
                  verifiedSource: businessMemory.marketPriceRange.source,
                  sourceType: "artisan_board",
                  confidence: "Verified",
                  lastUpdated: "Today",
                  priceTrend: "High Demand",
                  descriptionHindi: "हस्तनिर्मित टोकरियाँ",
                  descriptionEnglish: "Handmade baskets",
                  recommendedPackaging: "Bundle packaging",
                }}
                onFindBuyers={() => handleProcessTurn("Buyer dhoondo")}
                lang={lang}
              />
            )}

            {(businessMemory.conversationPhase === "BUYER_DISCOVERY" || businessMemory.conversationPhase === "NEGOTIATION") && (
              <BuyerDiscoveryList
                buyers={SEED_BUYERS}
                onSelectBuyerToCall={(buyer) => {
                  setActiveBuyerCall(buyer);
                }}
                lang={lang}
              />
            )}

            {(businessMemory.conversationPhase === "BUSINESS_SUPPORT" || businessMemory.conversationPhase === "HUMAN_ESCALATION") && (
              <NgoSupportCard
                organizations={SEED_SUPPORT_ORGS}
                onRequestHumanAssistance={(org) => {
                  handleProcessTurn("Counselor se connect karo.");
                }}
                lang={lang}
              />
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: Live Agora RTC Buyer Voice Call */}
      {activeBuyerCall && (
        <BuyerCallModal
          buyer={activeBuyerCall}
          quantity={businessMemory.quantity || 120}
          product={businessMemory.product || "Handmade Baskets"}
          onEndCall={() => setActiveBuyerCall(null)}
          onAgreePrice={(agreedPrice) => {
            setActiveBuyerCall(null);
            setPendingDealData({
              buyerName: activeBuyerCall.name,
              organization: activeBuyerCall.organization,
              product: businessMemory.product || "Handmade Baskets",
              quantity: businessMemory.quantity || 120,
              agreedPrice,
            });
            setShowDealConfirmModal(true);
          }}
          lang={lang}
        />
      )}

      {/* MODAL 2: Human-in-the-Loop Commercial Deal Confirmation */}
      {showDealConfirmModal && pendingDealData && (
        <DealConfirmModal
          buyerName={pendingDealData.buyerName}
          organization={pendingDealData.organization}
          product={pendingDealData.product}
          quantity={pendingDealData.quantity}
          agreedPrice={pendingDealData.agreedPrice}
          onConfirm={handleConfirmDeal}
          onNegotiateMore={() => {
            setShowDealConfirmModal(false);
            setActiveBuyerCall(SEED_BUYERS[0]);
          }}
          onCancel={() => setShowDealConfirmModal(false)}
          lang={lang}
        />
      )}

      {/* MODAL 3: Structured Case Handoff & Human Escalation */}
      {activeEscalationCase && (
        <CaseEscalationModal
          caseData={activeEscalationCase}
          onClose={() => setActiveEscalationCase(null)}
          lang={lang}
        />
      )}

      {/* DRAWER: 9-Step Winning Demo Guide for Judges */}
      <DemoScenarioGuide
        isOpen={showDemoGuide}
        onClose={() => setShowDemoGuide(false)}
        onRunStep={(stepNum) => {
          handleRunDemoStep(stepNum);
          setShowDemoGuide(false);
        }}
        currentStep={currentDemoStep}
      />
    </div>
  );
}
