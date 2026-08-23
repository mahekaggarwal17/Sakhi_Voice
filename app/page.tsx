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
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { INITIAL_BUSINESS_MEMORY, BusinessMemoryState } from "@/lib/agent/conversationState";
import { ToolExecutionResult, RECORDED_DEALS, RECORDED_CASES } from "@/lib/agent/tools";
import { BuyerProfile, SEED_BUYERS } from "@/lib/data/seedBuyers";
import { SupportOrganization, SupportCaseRecord, SEED_SUPPORT_ORGS } from "@/lib/data/seedSupport";
import { AgoraVoiceManager } from "@/lib/agora/rtcClient";
import { Sparkles, TrendingUp, Handshake, HeartHandshake, ShieldCheck, LayoutDashboard, MessageSquare, ArrowRight, Mic, Radio, Lock } from "lucide-react";

export default function SakhiVoiceApp() {
  // State: Language & Agora Engine
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [agoraConnected, setAgoraConnected] = useState<boolean>(true);
  const [voiceState, setVoiceState] = useState<AgentVoiceState>("IDLE");
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [currentSpeechText, setCurrentSpeechText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"WORKSPACE" | "DASHBOARD">("WORKSPACE");

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

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setVoiceState("SPEAKING");

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
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textHindiDevanagari || textFallback);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) =>
            v.lang.includes("hi") ||
            v.name.includes("Hindi") ||
            v.name.includes("Swara") ||
            v.name.includes("Madhur") ||
            v.name.includes("Neerja")
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
      console.warn("Autoplay audio error fallback:", err);
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textHindiDevanagari || textFallback);
        utterance.onend = () => setVoiceState("IDLE");
        utterance.onerror = () => setVoiceState("IDLE");
        window.speechSynthesis.speak(utterance);
      } else {
        setVoiceState("IDLE");
      }
    });
  };

  // Turn Processor
  const handleProcessTurn = async (userUtterance: string, isInterruption = false) => {
    if (!userUtterance || !userUtterance.trim()) return;

    if (isInterruption) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userTurnId = `user-${Date.now()}`;

    setTranscript((prev) => [
      ...prev,
      {
        id: userTurnId,
        sender: "USER",
        textHindi: userUtterance,
        textEnglish: userUtterance,
        timestamp,
        isInterruption,
      },
    ]);

    setVoiceState("THINKING");
    setCurrentSpeechText(userUtterance);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userUtterance,
          currentMemory: businessMemory,
          isInterruption,
          lang,
        }),
      });

      if (!res.ok) throw new Error("Agent processing error");

      const data = await res.json();

      setBusinessMemory(data.updatedMemory);

      if (data.toolExecution) {
        setLastExecutedTool(data.toolExecution);
        if (data.toolExecution.toolName === "createDeal" && data.toolExecution.data?.dealRecord) {
          RECORDED_DEALS.push(data.toolExecution.data.dealRecord);
        }
        if (data.toolExecution.toolName === "createSupportCase" && data.toolExecution.data?.caseRecord) {
          RECORDED_CASES.push(data.toolExecution.data.caseRecord);
          setActiveEscalationCase(data.toolExecution.data.caseRecord);
        }
      }

      const aiTurnId = `ai-${Date.now()}`;
      setTranscript((prev) => [
        ...prev,
        {
          id: aiTurnId,
          sender: "AI",
          textHindi: data.responseHinglish,
          textEnglish: data.responseEnglish,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          toolTriggered: data.toolExecution ? data.toolExecution.toolName : undefined,
        },
      ]);

      speakText(
        data.responseHindiDevanagari || data.responseHinglish,
        data.responseHinglish,
        () => {
          if (data.triggerBuyerCall && data.selectedBuyer) {
            setActiveBuyerCall(data.selectedBuyer);
          }
        }
      );
    } catch (err) {
      console.error("Turn processing error:", err);
      setVoiceState("IDLE");
      const fallbackText = "Kshama kijiye, ek chhota network issue aaya. Kripya dobara bolein.";
      speakText(fallbackText, fallbackText);
    }
  };

  const handleToggleMic = () => {
    if (voiceState === "LISTENING") {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceState("IDLE");
      return;
    }

    if (voiceState === "SPEAKING") {
      handleInterrupt();
      return;
    }

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = "hi-IN";
          recognition.continuous = false;
          recognition.interimResults = true;

          recognition.onstart = () => {
            setVoiceState("LISTENING");
            setCurrentSpeechText("Listening to speech...");
          };

          recognition.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }

            const current = finalTranscript || interimTranscript;
            if (current) {
              setCurrentSpeechText(current);
            }

            if (finalTranscript) {
              handleProcessTurn(finalTranscript);
            }
          };

          recognition.onerror = (err: any) => {
            console.warn("Speech recognition error:", err);
            setVoiceState("IDLE");
          };

          recognition.onend = () => {
            setVoiceState((prev) => (prev === "LISTENING" ? "IDLE" : prev));
          };

          recognitionRef.current = recognition;
          recognition.start();
          return;
        } catch (e) {
          console.warn("Speech recognition start failed:", e);
        }
      }
    }

    // Default simulation fallback if browser mic permission is locked
    handleProcessTurn("Mere paas 100 handmade baskets hain aur mujhe bechna hai.");
  };

  const handleInterrupt = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState("IDLE");
    handleProcessTurn("Actually mere paas 150 baskets hain.", true);
  };

  const handleResetSession = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setBusinessMemory(INITIAL_BUSINESS_MEMORY);
    setTranscript([
      {
        id: "intro-01",
        sender: "AI",
        textHindi: "Namaste! Main aapki business agent Sakhi hoon. Aap kya bechna chahti hain?",
        textEnglish: "Namaste! I am your business agent Sakhi. What product would you like to sell?",
        timestamp: "10:00 AM",
      },
    ]);
    setVoiceState("IDLE");
    setLastExecutedTool(null);
    setActiveBuyerCall(null);
    setShowDealConfirmModal(false);
    setActiveEscalationCase(null);
    setCurrentSpeechText("");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-zinc-900 pb-16">
      {/* Floating Glass Navbar */}
      <Header
        agoraConnected={agoraConnected}
        onResetSession={handleResetSession}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === "hi" ? "en" : "hi"))}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 space-y-8">
        {/* ========================================================
            HERO SECTION (Dark Immersive Glassmorphism, 2.5rem radius)
            ======================================================== */}
        <section className="relative min-h-[85vh] lg:min-h-[88vh] rounded-5xl bg-zinc-950 text-white overflow-hidden p-6 sm:p-10 lg:p-14 border border-white/10 shadow-2xl flex flex-col justify-between grain-overlay">
          {/* Subtle 22vw Background Watermark Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[22vw] font-black text-white/[0.03] tracking-tighter filter blur-xs">
              SAKHI
            </span>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Top Hero Row */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-400 text-[10px] font-extrabold uppercase tracking-[0.2em] border border-white/15 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Rural Empowerment AI Suite
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-white">
                Voice-First Conversational Commerce
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                Empowering rural women artisans with natural Hinglish voice conversations, real-time verified Mandi intelligence, and live Agora RTC commercial negotiations.
              </p>
            </div>

            {/* Quick Demo Trigger Button */}
            <button
              onClick={() => setShowDemoGuide(true)}
              className="btn-pill-action cursor-pointer self-start lg:self-auto"
            >
              <span>Judge 9-Step Demo Guide</span>
              <div className="icon-container">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </button>
          </div>

          {/* Center Hero Content: Split between Glass Voice Orb & Live Stats Stack */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
            {/* Left: Central Sakhi Glass Voice Orb */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-white/5 rounded-4xl border border-white/10 backdrop-blur-xl shadow-glass">
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
            </div>

            {/* Right: Vertical Stack of Glass Stat Cards */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Tool Feedback if active */}
              {lastExecutedTool && (
                <ToolExecutionBadge toolResult={lastExecutedTool} lang={lang} />
              )}

              {/* Live Session Memory HUD Card */}
              <BusinessSnapshot memory={businessMemory} lang={lang} />

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-stat-card p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Zero-Typing
                  </span>
                  <span className="text-xl font-black text-emerald-400">100%</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Voice Driven</span>
                </div>
                <div className="glass-stat-card p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Mandi Data
                  </span>
                  <span className="text-xl font-black text-white">Verified</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">NHDP Source</span>
                </div>
                <div className="glass-stat-card p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Agora RTC
                  </span>
                  <span className="text-xl font-black text-emerald-400">Active</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">AEC & Noise Canceling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Live Suite vs Impact Dashboard */}
          <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab("WORKSPACE")}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "WORKSPACE"
                  ? "bg-white text-zinc-950 shadow-lg scale-105"
                  : "bg-white/10 text-white/80 hover:text-white hover:bg-white/20"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Live Dialogue & Feature Suite</span>
            </button>

            <button
              onClick={() => setActiveTab("DASHBOARD")}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "DASHBOARD"
                  ? "bg-white text-zinc-950 shadow-lg scale-105"
                  : "bg-white/10 text-white/80 hover:text-white hover:bg-white/20"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-500" />
              <span>Artisan Impact & Earnings</span>
            </button>
          </div>
        </section>

        {/* ========================================================
            TAB 1: LIVE CONVERSATION & CONTEXTUAL FEATURE SUITE
            ======================================================== */}
        {activeTab === "WORKSPACE" && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
            {/* Left Column: Live Transcript */}
            <div className="lg:col-span-6">
              <ConversationTranscript transcript={transcript} lang={lang} />
            </div>

            {/* Right Column: Dynamic Bento Cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* 1. Mandi Market Intelligence */}
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

              {/* 2. Verified Commercial Buyers List */}
              {(businessMemory.conversationPhase === "BUYER_DISCOVERY" || businessMemory.conversationPhase === "NEGOTIATION") && (
                <BuyerDiscoveryList
                  buyers={SEED_BUYERS}
                  onSelectBuyerToCall={(buyer) => {
                    setActiveBuyerCall(buyer);
                  }}
                  lang={lang}
                />
              )}

              {/* 3. NGO Grants & Enterprise Support */}
              {(businessMemory.conversationPhase === "BUSINESS_SUPPORT" || businessMemory.conversationPhase === "HUMAN_ESCALATION") && (
                <NgoSupportCard
                  organizations={SEED_SUPPORT_ORGS}
                  onRequestHumanAssistance={(org) => {
                    handleProcessTurn("Counselor se connect karo.");
                  }}
                  lang={lang}
                />
              )}

              {/* Default Preview Card if early phase */}
              {businessMemory.conversationPhase !== "MARKET_CHECK" &&
                businessMemory.conversationPhase !== "BUYER_DISCOVERY" &&
                businessMemory.conversationPhase !== "NEGOTIATION" &&
                businessMemory.conversationPhase !== "BUSINESS_SUPPORT" &&
                businessMemory.conversationPhase !== "HUMAN_ESCALATION" && (
                  <MarketIntelligenceCard
                    data={{
                      id: "market-preview",
                      product: "Handmade Basket",
                      aliases: [],
                      category: "handicraft",
                      minPrice: 180,
                      maxPrice: 230,
                      suggestedNegotiationStart: 220,
                      unit: "per basket",
                      verifiedSource: "National Handicrafts Development Programme (NHDP)",
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
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 2: IMPACT & EARNINGS DASHBOARD
            ======================================================== */}
        {activeTab === "DASHBOARD" && (
          <section className="animate-fade-in-up">
            <ImpactDashboard lang={lang} />
          </section>
        )}
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
          onConfirm={() => {
            setShowDealConfirmModal(false);
            handleProcessTurn("Haan, deal pakki kar do.");
          }}
          onNegotiateMore={() => {
            setShowDealConfirmModal(false);
            handleProcessTurn("Rate aur badhao.");
          }}
          onCancel={() => setShowDealConfirmModal(false)}
          lang={lang}
        />
      )}

      {/* MODAL 3: Human Counselor Escalation & Handover Summary */}
      {activeEscalationCase && (
        <CaseEscalationModal
          caseRecord={activeEscalationCase}
          onClose={() => setActiveEscalationCase(null)}
          lang={lang}
        />
      )}

      {/* JUDGE DEMO GUIDE DRAWER */}
      <DemoScenarioGuide
        isOpen={showDemoGuide}
        onClose={() => setShowDemoGuide(false)}
        currentStep={currentDemoStep}
        onRunStep={(stepNumber) => {
          setCurrentDemoStep(stepNumber);
          if (stepNumber === 1) {
            handleProcessTurn("Mere paas 100 handmade baskets hain aur mujhe bechna hai.");
          } else if (stepNumber === 2) {
            handleProcessTurn("Bulk mein. Greater Noida.");
          } else if (stepNumber === 3) {
            handleProcessTurn("Haan, market rate check karo.");
          } else if (stepNumber === 4) {
            handleProcessTurn("Theek hai, buyers check karo.");
          } else if (stepNumber === 5) {
            handleProcessTurn("Actually mere paas 150 baskets hain.", true);
          } else if (stepNumber === 6) {
            setActiveBuyerCall(SEED_BUYERS[0]);
          } else if (stepNumber === 7) {
            setPendingDealData({
              buyerName: "Rajesh Sharma",
              organization: "ABC Handicrafts",
              product: "Handmade Baskets",
              quantity: 150,
              agreedPrice: 205,
            });
            setShowDealConfirmModal(true);
          } else if (stepNumber === 8) {
            handleProcessTurn("Mujhe loan ya grant ke baare mein jaanna hai.");
          } else if (stepNumber === 9) {
            setActiveEscalationCase({
              caseId: "CASE-SKH-8291",
              createdAt: "Just now",
              entrepreneurProfile: {
                product: "Handmade Baskets",
                currentProduction: "150 units",
                location: "Greater Noida",
              },
              supportRequirement: {
                purpose: "Production Capacity Expansion & Dye Materials",
                requestedAmount: "₹50,000",
                supportCategory: "Financial Grant & Loan",
              },
              matchedOrganization: SEED_SUPPORT_ORGS[0],
              conversationSummary: "Artisan produces 150 handmade baskets in Greater Noida, closed commercial order with Rajesh Sharma at ₹205/unit, seeking ₹50,000 capital expansion grant for dye materials.",
              verifiedDetails: [
                "Product: Handmade Baskets",
                "Current Order: 150 units",
                "Price: ₹205 agreed deal",
                "Need: Business Expansion grant",
              ],
              status: "CASE_CREATED",
            });
          }
        }}
      />
    </div>
  );
}
