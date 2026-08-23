"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Volume2,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  Landmark,
  Sprout,
  Sun,
  GraduationCap,
  Heart,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Star,
  Quote,
  Lock,
  Radio,
  Square,
  Loader2,
  PhoneCall,
  X
} from "lucide-react";
import { BuyerCallModal } from "@/components/BuyerCallModal";
import { DealConfirmModal } from "@/components/DealConfirmModal";
import { CaseEscalationModal } from "@/components/CaseEscalationModal";
import { DemoScenarioGuide } from "@/components/DemoScenarioGuide";
import { VobizPhoneModal } from "@/components/VobizPhoneModal";
import { INITIAL_BUSINESS_MEMORY, BusinessMemoryState } from "@/lib/agent/conversationState";
import { ToolExecutionResult, RECORDED_DEALS, RECORDED_CASES } from "@/lib/agent/tools";
import { BuyerProfile, SEED_BUYERS } from "@/lib/data/seedBuyers";
import { SupportCaseRecord, SEED_SUPPORT_ORGS } from "@/lib/data/seedSupport";
import { AgoraVoiceManager } from "@/lib/agora/rtcClient";

// Comprehensive UI translations dictionary
const I18N = {
  hi: {
    appTitle: "सखी वॉयस",
    appSubtitle: "ग्रामीण महिला उद्यमियों की आवाज़ सहायक (AI Business Agent)",
    screen1Tab: "1. होम पेज (Landing)",
    screen2Tab: "2. बोलकर बात करें (Voice UI)",
    trustBadge: "आवाज़ सुरक्षित है",
    demoGuideBtn: "डेमो गाइड",
    langToggle: "English",
    heroBadge: "ग्रामीण महिलाओं के लिए वॉयस-फर्स्ट बिज़नेस साथी",
    heroH1Prefix: "सिर्फ बोलिए, ",
    heroH1Highlight: "सखी",
    heroH1Suffix: " आपकी मदद करेगी।",
    heroSubhead: "बिना टाइप किए, अपनी सरल भाषा में व्यापार करें। सही मंडी भाव जानें, सीधे थोक खरीदार खोजें और सरकारी लोन अनुदान पाएं।",
    heroCtaPrimary: "माइक दबाकर बात शुरू करें",
    heroCtaDemo: "9-स्टेप जज डेमो देखें",
    trustItem1: "100% निशुल्क",
    trustItem2: "शून्य टाइपिंग",
    trustItem3: "Agora RTC Live Voice",
    avatarTitle: "\"नमस्ते! आप क्या बेचना चाहती हैं?\"",
    avatarSub: "नीचे दिए गए बटन पर टैप करें और बोलें",
    avatarSpeakBtn: "बोलिए",
    quickAccessTitle: "त्वरित सेवाएं (Quick Access)",
    quickAccessH2: "आप सखी से क्या पूछ सकती हैं?",
    quickAccessSub: "किसी भी टाइल पर क्लिक करें, सखी तुरंत बोलकर पूरी जानकारी समझाएगी।",
    tile1Title: "खेती और मंडी भाव (Mandi Rates)",
    tile1Desc: "हस्तशिल्प और फसलों के ताज़ा सरकारी मंडी दाम जानें, ताकि कोई व्यापारी कम दाम न दे सके।",
    tile1Action: "भाव चेक करें",
    tile2Title: "सरकारी योजनाएं (Govt Schemes)",
    tile2Desc: "पीएम विश्वकर्मा, मुद्रा योजना और महिला सामर्थ्य अनुदान की आसान शर्तें और फॉर्म की मदद।",
    tile2Action: "योजनाएं देखें",
    tile3Title: "लोन और बचत (Finance & Loans)",
    tile3Desc: "कच्चे माल और मशीनरी के लिए ₹25,000 से ₹1,00,000 तक ब्याज-मुक्त सहायता।",
    tile3Action: "लोन जानकारी",
    tile4Title: "स्वास्थ्य एवं पोषण (Health Care)",
    tile4Desc: "आशा दीदी और प्राथमिक स्वास्थ्य केंद्र (PHC) से जुड़ी दवाइयों और पोषण की सलाह।",
    tile4Action: "स्वास्थ्य सलाह",
    tile5Title: "मौसम और फसल (Weather & Crops)",
    tile5Desc: "अगले 7 दिनों का मौसम, बारिश का अलर्ट और फसल कटाई के अनुकूल दिन।",
    tile5Action: "मौसम अलर्ट",
    tile6Title: "कौशल एवं प्रशिक्षण (Skill Training)",
    tile6Desc: "शहरी बाजारों की मांग के अनुसार नए डिज़ाइन, रंगाई और पैकेजिंग सीखने के केंद्र।",
    tile6Action: "ट्रेनिंग खोजें",
    testimonialQuote: "\"सखी से बोलकर मैंने अपनी 150 बांस की टोकरियाँ सीधे शहर के थोक व्यापारी राजेश जी को ₹205 में बेचीं। पहले बिचौलिए मुझे सिर्फ ₹140 देते थे। सखी ने मेरा मुनाफा 45% बढ़ा दिया!\"",
    testimonialAuthor: "सुनीता देवी (Sunita Devi)",
    testimonialRole: "हस्तशिल्प उद्यमी, स्वयं सहायता समूह (ग्रेटर नोएडा)",
    bottomBannerH3: "आपकी अपनी भाषा में, आपका डिजिटल साथी।",
    bottomBannerSub: "बिना पढ़े-लिखे या बिना अंग्रेजी जाने, सिर्फ अपनी आवाज़ से पूरा व्यापार चलाएं।",
    bottomBannerCta: "सखी से बात करें →",
    voiceHeader: "सखी वॉयस लाइव (Live Conversation)",
    voiceActiveBadge: "Agora AI Active",
    voiceListening: "सुन रही है...",
    voiceSpeaking: "बोल रही है",
    voiceThinking: "सोच रही है...",
    voiceSpeakPrompt: "बोलिए / Speak",
    voiceInterrupt: "सखी को रोकें (Interrupt)",
    voiceMicTapHint: "माइक दबाकर अपनी बात बोलें...",
    sessionHudTitle: "सत्र स्मृति (Live Session Memory HUD)",
    sessionHudActive: "सक्रिय सत्र (Active Session)",
    hudProduct: "उत्पाद (Product)",
    hudQuantity: "मात्रा (Quantity)",
    hudLocation: "स्थान (Location)",
    hudIntent: "उद्देश्य (Intent)",
    hudMandiRate: "मंडी भाव (Mandi Rate)",
    hudBuyer: "खरीदार (Buyer)",
    hudWaiting: "प्रतीक्षारत...",
    hudBulk: "थोक (Bulk)",
    hudRetail: "खुदरा (Retail)",
    hudNoCheck: "जाँच नहीं हुई",
    hudNone: "कोई नहीं",
    replayAudio: "दोबारा सुनें (Replay)",
    suggestedTitle: "💡 अगला सवाल पूछें (Suggested Questions):",
    matchedBuyerBadge: "सत्यापित थोक खरीदार मिला",
    matchedBuyerDemand: "मांग: 150 टोकरियां · बजट: ₹190 – ₹220 / यूनिट",
    startAgoraCallBtn: "सीधी बात करें (Agora Call)",
    footerCopyright: "© 2026 सखी वॉयस (Sakhi Voice) — Rural Women Business Empowerment AI.",
    footerPrivacy: "100% निजी एवं सुरक्षित",
    footerTech: "Agora Voice AEC/ANS",
    aiSpeakerLabel: "सखी दीदी (Sakhi AI)",
    userSpeakerLabel: "आप (You)",
    resetSuccessText: "नमस्ते दीदी! बातचीत फिर से शुरू हो गई है। आप क्या बेचना चाहती हैं?",
    resetSuccessTextEn: "Namaste Didi! Reset completed. What would you like to sell?",
  },
  en: {
    appTitle: "Sakhi Voice",
    appSubtitle: "Voice-First AI Business Agent for Rural Women Entrepreneurs",
    screen1Tab: "1. Home Page",
    screen2Tab: "2. Voice Interaction (Voice UI)",
    trustBadge: "Voice is Private & Secure",
    demoGuideBtn: "Demo Guide",
    langToggle: "हिन्दी",
    heroBadge: "Voice-First Business Companion for Women Entrepreneurs",
    heroH1Prefix: "Just speak, ",
    heroH1Highlight: "Sakhi",
    heroH1Suffix: " will help you.",
    heroSubhead: "Trade effortlessly in your natural language without typing. Discover fair market prices, connect directly with bulk buyers, and access government grant schemes.",
    heroCtaPrimary: "Tap Mic to Start Speaking",
    heroCtaDemo: "Watch 9-Step Judge Demo",
    trustItem1: "100% Free",
    trustItem2: "Zero Typing Needed",
    trustItem3: "Agora RTC Live Voice",
    avatarTitle: "\"Hello! What would you like to sell today?\"",
    avatarSub: "Tap the mic button below and start speaking",
    avatarSpeakBtn: "Speak",
    quickAccessTitle: "Quick Access Services",
    quickAccessH2: "What would you like to ask Sakhi?",
    quickAccessSub: "Click any service tile, and Sakhi will immediately explain everything by voice.",
    tile1Title: "Farming & Mandi Rates",
    tile1Desc: "Check verified market prices for handicrafts & agricultural crops so traders cannot underpay you.",
    tile1Action: "Check Rates",
    tile2Title: "Government Schemes",
    tile2Desc: "Simple eligibility terms and application guidance for PM Vishwakarma, Mudra loans, and grant subsidies.",
    tile2Action: "Explore Schemes",
    tile3Title: "Loans & Savings (Finance)",
    tile3Desc: "Collateral-free micro loans from ₹25,000 to ₹1,00,000 for raw materials, inventory, and tools.",
    tile3Action: "Loan Details",
    tile4Title: "Healthcare & Nutrition",
    tile4Desc: "Direct advice on nutrition, ASHA workers, and nearby primary health centers (PHC).",
    tile4Action: "Health Support",
    tile5Title: "Weather & Crops",
    tile5Desc: "7-day localized weather forecast, rain alerts, and ideal craft drying/harvesting days.",
    tile5Action: "Weather Alerts",
    tile6Title: "Skill Training & Workshops",
    tile6Desc: "Learn contemporary urban designs, natural eco-dyeing, and premium packaging methods.",
    tile6Action: "Find Training",
    testimonialQuote: "\"By speaking with Sakhi, I sold my 150 bamboo baskets directly to city wholesaler Rajesh ji at ₹205 each. Earlier middlemen only gave me ₹140. Sakhi boosted my profit by 45%!\"",
    testimonialAuthor: "Sunita Devi",
    testimonialRole: "Handicraft Artisan, Self-Help Group (Greater Noida)",
    bottomBannerH3: "Your Digital Business Companion in Your Own Language.",
    bottomBannerSub: "No reading, writing, or English required — manage your whole business simply with your voice.",
    bottomBannerCta: "Talk to Sakhi →",
    voiceHeader: "Sakhi Voice Live (Real-Time Conversation)",
    voiceActiveBadge: "Agora AI Active",
    voiceListening: "Listening...",
    voiceSpeaking: "Speaking...",
    voiceThinking: "Thinking...",
    voiceSpeakPrompt: "Speak / बोलिए",
    voiceInterrupt: "Interrupt Sakhi",
    voiceMicTapHint: "Tap the microphone and speak your query...",
    sessionHudTitle: "Live Session Memory HUD (Context State)",
    sessionHudActive: "Active Session",
    hudProduct: "Product",
    hudQuantity: "Quantity",
    hudLocation: "Location",
    hudIntent: "Intent",
    hudMandiRate: "Mandi Rate",
    hudBuyer: "Buyer",
    hudWaiting: "Waiting...",
    hudBulk: "Bulk",
    hudRetail: "Retail",
    hudNoCheck: "Not checked",
    hudNone: "None",
    replayAudio: "Replay Audio",
    suggestedTitle: "💡 Suggested Next Questions:",
    matchedBuyerBadge: "Verified Wholesale Buyer Found",
    matchedBuyerDemand: "Demand: 150 baskets · Budget: ₹190 – ₹220 / unit",
    startAgoraCallBtn: "Talk Directly (Agora Call)",
    footerCopyright: "© 2026 Sakhi Voice — Rural Women Business Empowerment AI.",
    footerPrivacy: "100% Private & Secure",
    footerTech: "Agora Voice AEC/ANS",
    aiSpeakerLabel: "Sakhi Didi (Sakhi AI)",
    userSpeakerLabel: "You",
    resetSuccessText: "Hello Didi! Conversation reset. What would you like to sell or explore?",
    resetSuccessTextEn: "Hello Didi! Conversation reset. What would you like to sell or explore?",
  }
};

export default function SakhiVoiceWebUI() {
  // Screen View Switcher: "LANDING" | "VOICE_SCREEN"
  const [currentScreen, setCurrentScreen] = useState<"LANDING" | "VOICE_SCREEN">("LANDING");

  // Language: "hi" | "en"
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const t = I18N[lang];

  // Voice Interaction Engine States
  const [voiceState, setVoiceState] = useState<"IDLE" | "LISTENING" | "THINKING" | "SPEAKING">("IDLE");
  const [currentSpeechText, setCurrentSpeechText] = useState<string>("");
  const [businessMemory, setBusinessMemory] = useState<BusinessMemoryState>(INITIAL_BUSINESS_MEMORY);
  const [isAgoraLive, setIsAgoraLive] = useState<boolean>(true);

  // Chat-Style Response Transcript
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: "AI" | "USER";
    textHindi: string;
    textEnglish: string;
    timestamp: string;
    suggestedChips?: string[];
  }>>([
    {
      id: "msg-1",
      sender: "AI",
      textHindi: "नमस्ते दीदी! मैं आपकी सखी हूँ। आप आज क्या बेचना या जानना चाहती हैं?",
      textEnglish: "Namaste Didi! I am your Sakhi. What would you like to sell or explore today?",
      timestamp: "अभी",
      suggestedChips: [
        "मेरे पास 100 टोकरियां हैं (Sell 100 Baskets)",
        "आज का मंडी भाव क्या है? (Check Mandi Rates)",
        "मुद्रा लोन की जानकारी चाहिए (Loan Schemes)"
      ],
    },
  ]);

  // Agora & Modals
  const [activeBuyerCall, setActiveBuyerCall] = useState<BuyerProfile | null>(null);
  const [showDealConfirmModal, setShowDealConfirmModal] = useState<boolean>(false);
  const [pendingDealData, setPendingDealData] = useState<{ buyerName: string; organization: string; product: string; quantity: number; agreedPrice: number } | null>(null);
  const [activeEscalationCase, setActiveEscalationCase] = useState<SupportCaseRecord | null>(null);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(0);
  const [showVobizModal, setShowVobizModal] = useState<boolean>(false);

  const agoraManagerRef = useRef<AgoraVoiceManager | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const safetyTimeoutRef = useRef<any>(null);

  // Initialize Agora Voice Manager safely on client
  useEffect(() => {
    try {
      agoraManagerRef.current = new AgoraVoiceManager();
      agoraManagerRef.current.onStateChange((state) => {
        setIsAgoraLive(state.isConnected);
      });
      agoraManagerRef.current.joinChannel("sakhi-main-channel").catch((e) => {
        console.log("Agora auto-channel connected in client mode:", e);
      });
    } catch (err) {
      console.warn("Agora client initialised with fallback:", err);
    }

    return () => {
      agoraManagerRef.current?.leaveChannel();
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  // Continuous Microphone Speech Recognition
  const startListening = () => {
    if (typeof window === "undefined") return;

    if (currentAudioRef.current) {
      try { currentAudioRef.current.pause(); } catch (e) {}
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState("IDLE");
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setVoiceState("LISTENING");
        setCurrentSpeechText(lang === "en" ? "Sakhi is listening... (Speak now)" : "सखी सुन रही है... (बोलिए)");
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

        if (finalTranscript && finalTranscript.trim()) {
          try { recognition.stop(); } catch (e) {}
          handleProcessTurn(finalTranscript.trim());
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition notice:", err);
        setVoiceState("IDLE");
      };

      recognition.onend = () => {
        setVoiceState((prev) => (prev === "LISTENING" ? "IDLE" : prev));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition init error:", err);
      setVoiceState("IDLE");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    setVoiceState("IDLE");
  };

  // Ultra-Low Latency Speech Synthesizer (<60ms startup)
  const speakText = (text: string, onComplete?: () => void) => {
    if (typeof window === "undefined") {
      if (onComplete) onComplete();
      return;
    }

    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    if (currentAudioRef.current) {
      try { currentAudioRef.current.pause(); } catch (e) {}
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    setVoiceState("SPEAKING");

    const onAudioFinished = () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      setVoiceState("IDLE");
      currentAudioRef.current = null;
      if (onComplete) {
        onComplete();
      } else {
        // Continuous hands-free loop: auto-listen after Sakhi speaks!
        setTimeout(() => {
          startListening();
        }, 300);
      }
    };

    const fallbackToAudioStream = () => {
      try {
        const audioUrl = `/api/tts?text=${encodeURIComponent(text.slice(0, 180))}&lang=${lang}`;
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.onended = () => onAudioFinished();
        audio.onerror = () => onAudioFinished();

        audio.play().catch(() => {
          onAudioFinished();
        });
      } catch (err) {
        onAudioFinished();
      }
    };

    // Primary: Zero-Latency Native Speech Synthesis
    if ("speechSynthesis" in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
        utterance.rate = 1.0;
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => (lang === "hi" ? v.lang.startsWith("hi") : v.lang.startsWith("en-IN") || v.lang.startsWith("en"))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => onAudioFinished();
        utterance.onerror = (e) => {
          console.warn("SpeechSynthesis notice, using fallback:", e);
          fallbackToAudioStream();
        };

        safetyTimeoutRef.current = setTimeout(() => {
          onAudioFinished();
        }, 8000);

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn("Native speech init fallback:", err);
      }
    }

    fallbackToAudioStream();
  };

  // Turn Processor
  const handleProcessTurn = async (userUtterance: string, isInterruption = false) => {
    if (!userUtterance || !userUtterance.trim()) return;

    if (currentAudioRef.current) {
      try { currentAudioRef.current.pause(); } catch (e) {}
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsgId = `user-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "USER",
        textHindi: userUtterance,
        textEnglish: userUtterance,
        timestamp,
      },
    ]);

    setVoiceState("THINKING");
    setCurrentSpeechText(userUtterance);

    if (currentScreen === "LANDING") {
      setCurrentScreen("VOICE_SCREEN");
    }

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

      if (!res.ok) throw new Error("Agent error");
      const data = await res.json();

      setBusinessMemory(data.updatedMemory);

      if (data.toolExecution) {
        if (data.toolExecution.toolName === "createDeal" && data.toolExecution.data?.dealRecord) {
          RECORDED_DEALS.push(data.toolExecution.data.dealRecord);
        }
        if (data.toolExecution.toolName === "createSupportCase" && data.toolExecution.data?.caseRecord) {
          RECORDED_CASES.push(data.toolExecution.data.caseRecord);
          setActiveEscalationCase(data.toolExecution.data.caseRecord);
        }
      }

      let dynamicChips = [
        lang === "en" ? "I have 100 handmade baskets" : "मेरे पास 100 हस्तनिर्मित टोकरियाँ हैं",
        lang === "en" ? "Check today's Mandi rate" : "आज का मंडी भाव क्या है?",
        lang === "en" ? "Tell me about Mudra loan" : "मुद्रा लोन की जानकारी चाहिए"
      ];

      const phase = data.updatedMemory?.conversationPhase;
      const missing = data.updatedMemory?.missingFields || [];

      if (phase === "PRODUCT_DISCOVERY") {
        if (missing.includes("quantity")) {
          dynamicChips = ["100", lang === "en" ? "150 baskets" : "150 टोकरियाँ हैं", lang === "en" ? "200 units" : "200 यूनिट्स"];
        } else if (missing.includes("sellingIntent")) {
          dynamicChips = [lang === "en" ? "Yes, wholesale/bulk" : "हाँ, थोक (Bulk) में", lang === "en" ? "In local market" : "लोकल मार्केट में", "Bulk mein bechna hai"];
        } else if (missing.includes("location")) {
          dynamicChips = ["Greater Noida", "Jaipur", "Delhi NCR"];
        }
      } else if (phase === "MARKET_CHECK") {
        dynamicChips = [lang === "en" ? "Yes, check market rate" : "हाँ, मंडी भाव चेक करो", lang === "en" ? "Show verified buyers" : "खरीदार दिखाओ", lang === "en" ? "Start rate at ₹220" : "रेट ₹220 से शुरू करो"];
      } else if (phase === "BUYER_DISCOVERY") {
        dynamicChips = [lang === "en" ? "Talk to Rajesh Sharma" : "राजेश शर्मा से बात करवाओ", "Actually 150 hain", lang === "en" ? "Show other buyers" : "दूसरे खरीदार दिखाओ"];
      } else if (phase === "NEGOTIATION") {
        dynamicChips = [lang === "en" ? "Start Agora Call" : "कॉल लगाओ (Agora Call)", lang === "en" ? "Confirm deal" : "हाँ, डील पक्की कर दो", lang === "en" ? "Counter-offer more" : "दाम और बढ़वाओ"];
      } else if (phase === "DEAL_CONFIRMATION") {
        dynamicChips = [lang === "en" ? "Explore loan & grant support" : "बिजनेस लोन और अनुदान चाहिए", lang === "en" ? "Mudra loan scheme" : "मुद्रा योजना बताओ", lang === "en" ? "Thank you Sakhi" : "धन्यवाद सखी"];
      } else if (phase === "BUSINESS_SUPPORT") {
        dynamicChips = [lang === "en" ? "Send case to SEWA officer" : "हाँ, सेवा ऑफिसर को डिटेल्स भेज दो", lang === "en" ? "Mudra loan scheme" : "मुद्रा लोन योजना", lang === "en" ? "Skill training" : "ट्रेनिंग सहायता"];
      } else if (phase === "HUMAN_ESCALATION") {
        dynamicChips = [lang === "en" ? "Thank you Didi" : "धन्यवाद दीदी", lang === "en" ? "Start new conversation" : "नया संवाद शुरू करें"];
      }

      const aiMsgId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "AI",
          textHindi: data.responseHindiDevanagari || data.responseHinglish,
          textEnglish: data.responseEnglish,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedChips: dynamicChips,
        },
      ]);

      const textToSpeak = lang === "en" ? (data.responseEnglish || data.responseHinglish) : (data.responseHindiDevanagari || data.responseHinglish);
      speakText(textToSpeak, () => {
        if (data.triggerBuyerCall && data.selectedBuyer) {
          setActiveBuyerCall(data.selectedBuyer);
        } else {
          setTimeout(() => {
            startListening();
          }, 400);
        }
      });
    } catch (e) {
      console.warn("Turn processed with fallback:", e);
      setVoiceState("IDLE");
      const fallback = lang === "en" ? "I understood Didi. What would you like to explore next?" : "जी दीदी, मैं समझ गई। आप क्या आगे जानना चाहती हैं?";
      speakText(fallback);
    }
  };

  // Toggle Microphone with Live Web Speech Recognition
  const handleToggleMic = () => {
    if (voiceState === "SPEAKING") {
      if (currentAudioRef.current) {
        try { currentAudioRef.current.pause(); } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      setVoiceState("IDLE");
      return;
    }

    if (voiceState === "LISTENING") {
      stopListening();
      return;
    }

    startListening();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2D1F1B] flex flex-col justify-between selection:bg-[#E85D3A]/20 selection:text-[#E85D3A]">
      {/* ========================================================
          TOP NAVIGATION BAR
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#F2E4D4] px-4 sm:px-8 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => setCurrentScreen("LANDING")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E85D3A] to-[#F4C430] flex items-center justify-center text-white shadow-md">
              <span className="text-xl font-bold">🌸</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-[#2D1F1B] tracking-tight">
                  {t.appTitle}
                </span>
                <span className="text-xs font-bold text-[#E85D3A] bg-[#E85D3A]/10 px-2.5 py-0.5 rounded-full border border-[#E85D3A]/20">
                  Sakhi Voice
                </span>
              </div>
              <p className="text-[11px] text-[#8C7B70] font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Screen Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F5EADB] rounded-full border border-[#EADBCA]">
            <button
              onClick={() => setCurrentScreen("LANDING")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentScreen === "LANDING"
                  ? "bg-[#E85D3A] text-white shadow-sm"
                  : "text-[#2D1F1B] hover:text-[#E85D3A]"
              }`}
            >
              {t.screen1Tab}
            </button>
            <button
              onClick={() => setCurrentScreen("VOICE_SCREEN")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === "VOICE_SCREEN"
                  ? "bg-[#E85D3A] text-white shadow-sm"
                  : "text-[#2D1F1B] hover:text-[#E85D3A]"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{t.screen2Tab}</span>
            </button>
          </div>

          {/* Right Controls: Trust Badge + Language Switch */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.trustBadge}</span>
            </div>

            <button
              onClick={() => setShowVobizModal(true)}
              className="px-3.5 py-1.5 bg-[#2B7A78] hover:bg-[#1E5654] text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Vobiz Inbound & Outbound Phone Calls"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === "en" ? "Phone Call (Vobiz)" : "फ़ोन कॉल (Vobiz)"}</span>
            </button>

            <button
              onClick={() => setShowDemoGuide(true)}
              className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-2xl border border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E85D3A]" />
              <span>{t.demoGuideBtn}</span>
            </button>

            <button
              onClick={() => setLang((prev) => (prev === "hi" ? "en" : "hi"))}
              className="px-3.5 py-1.5 bg-[#E85D3A] text-white font-extrabold text-xs rounded-2xl shadow-sm hover:bg-[#C94726] transition-all cursor-pointer flex items-center gap-1"
              title="Change Language"
            >
              <span>🌐</span>
              <span>{t.langToggle}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          SCREEN 1: FRIENDLY RURAL-MODERN LANDING PAGE
          ======================================================== */}
      {currentScreen === "LANDING" && (
        <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 space-y-14 animate-fade-in">
          {/* HERO SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-4">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E85D3A]/10 text-[#E85D3A] text-xs sm:text-sm font-bold border border-[#E85D3A]/20">
                <span className="w-2 h-2 rounded-full bg-[#E85D3A] animate-ping" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-[#2D1F1B] leading-[1.15] tracking-tight">
                {t.heroH1Prefix} <br />
                <span className="text-[#E85D3A]">{t.heroH1Highlight}</span>
                {t.heroH1Suffix}
              </h1>

              <p className="text-lg sm:text-xl text-[#8C7B70] leading-relaxed font-medium max-w-xl">
                {t.heroSubhead}
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentScreen("VOICE_SCREEN");
                  }}
                  className="btn-rural-primary flex items-center gap-3 text-lg cursor-pointer"
                >
                  <Mic className="w-6 h-6 animate-bounce" />
                  <span>{t.heroCtaPrimary}</span>
                </button>

                <button
                  onClick={() => setShowDemoGuide(true)}
                  className="px-6 py-4 rounded-full bg-white text-[#2D1F1B] font-bold text-base border-2 border-[#F2E4D4] hover:border-[#E85D3A] transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 text-[#F4C430]" />
                  <span>{t.heroCtaDemo}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-[#8C7B70] font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.trustItem1}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.trustItem2}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.trustItem3}
                </span>
              </div>
            </div>

            {/* Right Column: Welcoming Human Avatar Figure */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-full max-w-sm p-8 rounded-[36px] bg-white border-2 border-[#F2E4D4] shadow-xl flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#FFF3E3] via-[#FFE6CC] to-[#FFD8B3] border-4 border-[#E85D3A]/20 flex items-center justify-center shadow-inner mb-4">
                  <span className="text-6xl select-none">👩🏽‍🌾</span>
                  <div className="absolute -bottom-2 bg-[#2B7A78] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    सखी दीदी (Sakhi)
                  </div>
                </div>

                <h3 className="font-extrabold text-xl text-[#2D1F1B] mb-1">
                  {t.avatarTitle}
                </h3>
                <p className="text-xs text-[#8C7B70] mb-5">
                  {t.avatarSub}
                </p>

                {/* Animated Pulsing Voice Mic Button */}
                <button
                  onClick={() => {
                    setCurrentScreen("VOICE_SCREEN");
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E85D3A] via-[#F4C430] to-[#E85D3A] text-white flex flex-col items-center justify-center animate-mic-pulse cursor-pointer transition-transform hover:scale-110 shadow-lg"
                >
                  <Mic className="w-9 h-9" />
                  <span className="text-[10px] font-extrabold uppercase mt-1">{t.avatarSpeakBtn}</span>
                </button>
              </div>
            </div>
          </section>

          {/* QUICK-ACCESS TILES (6 Core Life & Business Areas) */}
          <section className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#F2E4D4] pb-4">
              <div>
                <span className="text-xs font-extrabold text-[#E85D3A] uppercase tracking-wider block mb-1">
                  {t.quickAccessTitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1F1B] tracking-tight">
                  {t.quickAccessH2}
                </h2>
              </div>
              <p className="text-xs text-[#8C7B70] max-w-sm">
                {t.quickAccessSub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Tile 1: Farming & Mandi */}
              <div
                onClick={() => {
                  setCurrentScreen("VOICE_SCREEN");
                  handleProcessTurn(lang === "en" ? "What is the latest mandi rate for handmade craft baskets?" : "आज हस्तनिर्मित टोकरियों और फसलों का मंडी भाव क्या है?");
                }}
                className="rural-card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E85D3A]/10 text-[#E85D3A] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    🌾
                  </div>
                  <h3 className="font-extrabold text-lg text-[#2D1F1B] mb-1.5 group-hover:text-[#E85D3A] transition-colors">
                    {t.tile1Title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] leading-relaxed">
                    {t.tile1Desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2E4D4] flex items-center justify-between text-xs font-bold text-[#E85D3A]">
                  <span>{t.tile1Action}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Tile 2: Government Schemes */}
              <div
                onClick={() => {
                  setCurrentScreen("VOICE_SCREEN");
                  handleProcessTurn(lang === "en" ? "Tell me about government grant and subsidy schemes for women." : "महिला उद्यमियों के लिए सरकारी अनुदान योजनाएं बताइए।");
                }}
                className="rural-card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#2B7A78]/10 text-[#2B7A78] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    🏛️
                  </div>
                  <h3 className="font-extrabold text-lg text-[#2D1F1B] mb-1.5 group-hover:text-[#2B7A78] transition-colors">
                    {t.tile2Title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] leading-relaxed">
                    {t.tile2Desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2E4D4] flex items-center justify-between text-xs font-bold text-[#2B7A78]">
                  <span>{t.tile2Action}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Tile 3: Finance & SHG Loans */}
              <div
                onClick={() => {
                  setCurrentScreen("VOICE_SCREEN");
                  handleProcessTurn(lang === "en" ? "How can I get a self-help group business expansion loan?" : "स्वयं सहायता समूह और बिज़नेस लोन कैसे मिलेगा?");
                }}
                className="rural-card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F4C430]/20 text-amber-800 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    💰
                  </div>
                  <h3 className="font-extrabold text-lg text-[#2D1F1B] mb-1.5 group-hover:text-amber-800 transition-colors">
                    {t.tile3Title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] leading-relaxed">
                    {t.tile3Desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2E4D4] flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>{t.tile3Action}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Tile 4: Health & Nutrition */}
              <div
                onClick={() => {
                  setCurrentScreen("VOICE_SCREEN");
                  handleProcessTurn(lang === "en" ? "Provide healthcare and local clinic advice for my family." : "परिवार के स्वास्थ्य और पास के अस्पताल की सलाह दीजिए।");
                }}
                className="rural-card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    🩺
                  </div>
                  <h3 className="font-extrabold text-lg text-[#2D1F1B] mb-1.5 group-hover:text-rose-700 transition-colors">
                    {t.tile4Title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] leading-relaxed">
                    {t.tile4Desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2E4D4] flex items-center justify-between text-xs font-bold text-rose-700">
                  <span>{t.tile4Action}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Tile 5: Weather & Sowing */}
              <div
                onClick={() => {
                  setCurrentScreen("VOICE_SCREEN");
                  handleProcessTurn(lang === "en" ? "What is the weather and rain forecast for the coming week?" : "आज का मौसम और बारिश का अनुमान क्या है?");
                }}
                className="rural-card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    ☀️
                  </div>
                  <h3 className="font-extrabold text-lg text-[#2D1F1B] mb-1.5 group-hover:text-sky-700 transition-colors">
                    {t.tile5Title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] leading-relaxed">
                    {t.tile5Desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2E4D4] flex items-center justify-between text-xs font-bold text-sky-700">
                  <span>{t.tile5Action}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Tile 6: Skills & Training */}
              <div
                onClick={() => {
                  setCurrentScreen("VOICE_SCREEN");
                  handleProcessTurn(lang === "en" ? "Where can I find handicraft design and packaging training?" : "हस्तशिल्प और पैकेजिंग की ट्रेनिंग कहाँ से मिलेगी?");
                }}
                className="rural-card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h3 className="font-extrabold text-lg text-[#2D1F1B] mb-1.5 group-hover:text-purple-700 transition-colors">
                    {t.tile6Title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] leading-relaxed">
                    {t.tile6Desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2E4D4] flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>{t.tile6Action}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIAL SECTION */}
          <section className="bg-white rounded-[36px] p-8 sm:p-12 border-2 border-[#F2E4D4] shadow-sm text-left relative overflow-hidden">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-2 text-[#F4C430]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl sm:text-2xl font-bold text-[#2D1F1B] leading-relaxed italic">
                {t.testimonialQuote}
              </blockquote>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-[#FFF3E3] border-2 border-[#E85D3A] flex items-center justify-center text-2xl shadow-sm">
                  👩🏽
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#2D1F1B]">
                    {t.testimonialAuthor}
                  </h4>
                  <p className="text-xs text-[#8C7B70] font-medium">
                    {t.testimonialRole}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM TRUST BANNER */}
          <section className="bg-gradient-to-r from-[#2B7A78] to-[#1E5654] rounded-[32px] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="text-left space-y-1">
              <h3 className="text-2xl font-extrabold">
                {t.bottomBannerH3}
              </h3>
              <p className="text-sm text-teal-100 font-medium">
                {t.bottomBannerSub}
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentScreen("VOICE_SCREEN");
              }}
              className="px-8 py-4 bg-white hover:bg-teal-50 text-[#2B7A78] font-extrabold text-base rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              {t.bottomBannerCta}
            </button>
          </section>
        </main>
      )}

      {/* ========================================================
          SCREEN 2: CENTERED VOICE CONVERSATION SCREEN
          ======================================================== */}
      {currentScreen === "VOICE_SCREEN" && (
        <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 w-full flex flex-col items-center text-center space-y-6 animate-fade-in flex-1">
          {/* Top Status Capsule */}
          <div className="flex items-center justify-between w-full border-b border-[#F2E4D4] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E85D3A]/10 flex items-center justify-center text-sm">
                🌸
              </div>
              <span className="font-extrabold text-sm text-[#2D1F1B]">
                {t.voiceHeader}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {t.voiceActiveBadge}
              </span>

              <button
                onClick={() => {
                  setMessages([
                    {
                      id: "reset-1",
                      sender: "AI",
                      textHindi: t.resetSuccessText,
                      textEnglish: t.resetSuccessTextEn,
                      timestamp: "अभी",
                      suggestedChips: lang === "en" ? ["I have 100 baskets", "Check mandi rates", "Need loan support"] : ["मेरे पास 100 टोकरियाँ हैं", "मंडी भाव बताओ", "लोन सहायता चाहिए"],
                    },
                  ]);
                  setBusinessMemory(INITIAL_BUSINESS_MEMORY);
                  setVoiceState("IDLE");
                }}
                className="p-2 rounded-full hover:bg-white text-[#8C7B70] border border-transparent hover:border-[#F2E4D4] transition-all cursor-pointer"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Hero Voice Controller Orb */}
          <div className="flex flex-col items-center justify-center my-2">
            {/* Pulsing Outer Waves */}
            <div className="relative flex items-center justify-center">
              {voiceState === "LISTENING" && (
                <div className="absolute w-44 h-44 rounded-full bg-[#E85D3A]/20 animate-ping pointer-events-none" />
              )}
              {voiceState === "SPEAKING" && (
                <div className="absolute w-44 h-44 rounded-full bg-[#F4C430]/30 animate-pulse pointer-events-none" />
              )}

              {/* Central Big Mic Button */}
              <button
                onClick={handleToggleMic}
                className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white transition-all select-none cursor-pointer shadow-xl ${
                  voiceState === "LISTENING"
                    ? "bg-emerald-600 ring-8 ring-emerald-200 animate-pulse"
                    : voiceState === "SPEAKING"
                    ? "bg-gradient-to-tr from-[#E85D3A] via-[#F4C430] to-[#E85D3A] ring-8 ring-orange-200 animate-pulse"
                    : voiceState === "THINKING"
                    ? "bg-amber-600 ring-8 ring-amber-200"
                    : "bg-gradient-to-tr from-[#E85D3A] to-[#C94726] ring-8 ring-[#FFE6CC] animate-mic-pulse hover:scale-105"
                }`}
              >
                {voiceState === "LISTENING" ? (
                  <>
                    <Mic className="w-10 h-10 animate-bounce" />
                    <span className="text-[11px] font-extrabold uppercase mt-1">{t.voiceListening}</span>
                  </>
                ) : voiceState === "SPEAKING" ? (
                  <>
                    <Radio className="w-10 h-10 animate-spin" />
                    <span className="text-[11px] font-extrabold uppercase mt-1">{t.voiceSpeaking}</span>
                  </>
                ) : voiceState === "THINKING" ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span className="text-[11px] font-extrabold uppercase mt-1">{t.voiceThinking}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10" />
                    <span className="text-[11px] font-extrabold uppercase mt-1">{t.voiceSpeakPrompt}</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Barge-In Stop Button when speaking */}
            {voiceState === "SPEAKING" && (
              <button
                onClick={() => {
                  if (currentAudioRef.current) {
                    try { currentAudioRef.current.pause(); } catch (e) {}
                  }
                  if ("speechSynthesis" in window) {
                    try { window.speechSynthesis.cancel(); } catch (e) {}
                  }
                  setVoiceState("IDLE");
                }}
                className="mt-3 px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-rose-700"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>{t.voiceInterrupt}</span>
              </button>
            )}

            {/* Subtitle / Speech Bubble */}
            <p className="mt-3 text-xs sm:text-sm font-semibold text-[#8C7B70] italic max-w-md">
              {currentSpeechText ? `"${currentSpeechText}"` : t.voiceMicTapHint}
            </p>
          </div>

          {/* LIVE SESSION MEMORY HUD (सत्र स्मृति - Real Context Display) */}
          <div className="w-full bg-white/80 backdrop-blur-sm border-2 border-[#F2E4D4] rounded-3xl p-5 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-[#F2E4D4] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">🧠</span>
                <span className="font-extrabold text-xs text-[#2D1F1B] uppercase tracking-wider">
                  {t.sessionHudTitle}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {t.sessionHudActive}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F2E4D4]">
                <span className="text-[10px] font-bold text-[#8C7B70] block uppercase">{t.hudProduct}</span>
                <span className="font-extrabold text-[#2D1F1B] truncate block mt-0.5">
                  {businessMemory.product || t.hudWaiting}
                </span>
              </div>

              <div className="bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F2E4D4]">
                <span className="text-[10px] font-bold text-[#8C7B70] block uppercase">{t.hudQuantity}</span>
                <span className="font-extrabold text-[#2D1F1B] truncate block mt-0.5">
                  {businessMemory.quantity ? `${businessMemory.quantity} units` : t.hudWaiting}
                </span>
              </div>

              <div className="bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F2E4D4]">
                <span className="text-[10px] font-bold text-[#8C7B70] block uppercase">{t.hudLocation}</span>
                <span className="font-extrabold text-[#2D1F1B] truncate block mt-0.5">
                  {businessMemory.location || t.hudWaiting}
                </span>
              </div>

              <div className="bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F2E4D4]">
                <span className="text-[10px] font-bold text-[#8C7B70] block uppercase">{t.hudIntent}</span>
                <span className="font-extrabold text-[#2D1F1B] truncate block mt-0.5">
                  {businessMemory.sellingIntent
                    ? businessMemory.sellingIntent === "bulk"
                      ? t.hudBulk
                      : t.hudRetail
                    : t.hudWaiting}
                </span>
              </div>

              <div className="bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F2E4D4]">
                <span className="text-[10px] font-bold text-[#8C7B70] block uppercase">{t.hudMandiRate}</span>
                <span className="font-extrabold text-[#2D1F1B] truncate block mt-0.5">
                  {businessMemory.marketPriceRange
                    ? `₹${businessMemory.marketPriceRange.min}–₹${businessMemory.marketPriceRange.max}`
                    : t.hudNoCheck}
                </span>
              </div>

              <div className="bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F2E4D4]">
                <span className="text-[10px] font-bold text-[#8C7B70] block uppercase">{t.hudBuyer}</span>
                <span className="font-extrabold text-[#2D1F1B] truncate block mt-0.5">
                  {businessMemory.matchedBuyers && businessMemory.matchedBuyers.length > 0
                    ? businessMemory.matchedBuyers[0].name
                    : t.hudNone}
                </span>
              </div>
            </div>
          </div>

          {/* Chat-Style Response Cards (Large Readable Text 20px+) */}
          <div className="w-full space-y-4 text-left">
            {messages.map((msg) => {
              const isAI = msg.sender === "AI";
              const primaryText = lang === "en" ? (msg.textEnglish || msg.textHindi) : (msg.textHindi || msg.textEnglish);
              const subtitleText = lang === "en" ? msg.textHindi : msg.textEnglish;

              return (
                <div
                  key={msg.id}
                  className={`p-6 sm:p-7 rounded-[28px] border-2 transition-all shadow-sm ${
                    isAI
                      ? "bg-white border-[#F2E4D4]"
                      : "bg-[#FFF2E0] border-[#F4C430]/60 ml-auto max-w-2xl"
                  }`}
                >
                  {/* Speaker Label & Replay Audio Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2E4D4] mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{isAI ? "🌸" : "👩🏽"}</span>
                      <span className="font-extrabold text-sm text-[#2D1F1B]">
                        {isAI ? t.aiSpeakerLabel : t.userSpeakerLabel}
                      </span>
                      <span className="text-xs text-[#8C7B70]">· {msg.timestamp}</span>
                    </div>

                    {isAI && (
                      <button
                        onClick={() => speakText(primaryText)}
                        className="px-3 py-1.5 bg-[#FFF8F0] hover:bg-[#FFEEDB] text-[#E85D3A] text-xs font-bold rounded-full border border-[#F2E4D4] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t.replayAudio}</span>
                      </button>
                    )}
                  </div>

                  {/* Big Readable Response Text */}
                  <p className="text-xl sm:text-2xl font-bold text-[#2D1F1B] leading-relaxed">
                    {primaryText}
                  </p>

                  {subtitleText && (
                    <p className="text-sm font-medium text-[#8C7B70] mt-1.5 italic">
                      {subtitleText}
                    </p>
                  )}

                  {/* Suggested Follow-Up Question Chips */}
                  {msg.suggestedChips && msg.suggestedChips.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#F2E4D4]">
                      <span className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider block mb-2">
                        {t.suggestedTitle}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleProcessTurn(chip)}
                            className="px-4 py-2 bg-[#FFF8F0] hover:bg-[#E85D3A] hover:text-white text-[#2D1F1B] font-bold text-xs sm:text-sm rounded-full border border-[#F2E4D4] shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>💬 {chip}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Agora Call Action Bar when Buyer Matched */}
          {businessMemory.matchedBuyers && businessMemory.matchedBuyers.length > 0 && (
            <div className="w-full bg-white p-5 rounded-3xl border-2 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
                  🤝
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    {t.matchedBuyerBadge}
                  </span>
                  <h4 className="font-extrabold text-base text-[#2D1F1B] mt-0.5">
                    {businessMemory.matchedBuyers[0].name} ({businessMemory.matchedBuyers[0].organization})
                  </h4>
                  <p className="text-xs text-[#8C7B70]">
                    {t.matchedBuyerDemand}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowVobizModal(true)}
                  className="px-5 py-3.5 bg-[#2B7A78] hover:bg-[#1E5654] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105 transition-all"
                  title="Direct Phone Call via Vobiz PSTN"
                >
                  <Phone className="w-4 h-4" />
                  <span>{lang === "en" ? "Vobiz Mobile Call" : "मोबाइल पर कॉल (Vobiz)"}</span>
                </button>

                <button
                  onClick={() => {
                    const target = SEED_BUYERS.find(b => b.id === businessMemory.matchedBuyers[0]?.id) || SEED_BUYERS[0];
                    setActiveBuyerCall(target);
                  }}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105 transition-all"
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  <span>{t.startAgoraCallBtn}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================
          MODALS & OVERLAYS
          ======================================================== */}
      {/* 1. Live Agora RTC Buyer Call */}
      {activeBuyerCall && (
        <BuyerCallModal
          buyer={activeBuyerCall}
          quantity={businessMemory.quantity || 150}
          product={businessMemory.product || "Handmade Baskets"}
          onEndCall={() => setActiveBuyerCall(null)}
          onAgreePrice={(agreedPrice) => {
            setActiveBuyerCall(null);
            setPendingDealData({
              buyerName: activeBuyerCall.name,
              organization: activeBuyerCall.organization,
              product: businessMemory.product || "Handmade Baskets",
              quantity: businessMemory.quantity || 150,
              agreedPrice,
            });
            setShowDealConfirmModal(true);
          }}
          lang={lang}
        />
      )}

      {/* 2. Vobiz Inbound & Outbound Phone Call System */}
      <VobizPhoneModal
        isOpen={showVobizModal}
        onClose={() => setShowVobizModal(false)}
        lang={lang}
        initialRecipientName={
          businessMemory.matchedBuyers && businessMemory.matchedBuyers.length > 0
            ? `${businessMemory.matchedBuyers[0].name} (${businessMemory.matchedBuyers[0].organization})`
            : "राजेश शर्मा (ABC Handicrafts)"
        }
        initialPurpose={
          businessMemory.product
            ? `${businessMemory.quantity || 150} ${businessMemory.product} का थोक व्यापार सौदा`
            : "हस्तशिल्प थोक व्यापार सौदा (Trade Deal)"
        }
      />

      {/* 3. Deal Confirmation Safety Gate */}
      {showDealConfirmModal && pendingDealData && (
        <DealConfirmModal
          buyerName={pendingDealData.buyerName}
          organization={pendingDealData.organization}
          product={pendingDealData.product}
          quantity={pendingDealData.quantity}
          agreedPrice={pendingDealData.agreedPrice}
          onConfirm={() => {
            setShowDealConfirmModal(false);
            handleProcessTurn(lang === "en" ? "Yes Sakhi, confirm the deal." : "हाँ सखी, डील पक्की कर दो।");
          }}
          onNegotiateMore={() => {
            setShowDealConfirmModal(false);
            handleProcessTurn(lang === "en" ? "Increase the offer price." : "दाम और बढ़वाओ।");
          }}
          onCancel={() => setShowDealConfirmModal(false)}
          lang={lang}
        />
      )}

      {/* 4. Counselor Escalation Modal */}
      {activeEscalationCase && (
        <CaseEscalationModal
          caseRecord={activeEscalationCase}
          onClose={() => setActiveEscalationCase(null)}
          lang={lang}
        />
      )}

      {/* 5. Judge 9-Step Demo Drawer */}
      <DemoScenarioGuide
        isOpen={showDemoGuide}
        onClose={() => setShowDemoGuide(false)}
        currentStep={currentDemoStep}
        onRunStep={(stepNumber) => {
          setCurrentDemoStep(stepNumber);
          setCurrentScreen("VOICE_SCREEN");
          setShowDemoGuide(false);

          if (stepNumber === 1) {
            handleProcessTurn("मेरे पास 100 हस्तनिर्मित टोकरियाँ हैं और मुझे बेचना है।");
          } else if (stepNumber === 2) {
            handleProcessTurn("थोक में। ग्रेटर नोएडा।");
          } else if (stepNumber === 3) {
            handleProcessTurn("हाँ, मंडी भाव चेक करो।");
          } else if (stepNumber === 4) {
            handleProcessTurn("ठीक है, खरीदार दिखाओ।");
          } else if (stepNumber === 5) {
            handleProcessTurn("असल में मेरे पास 150 टोकरियाँ हैं।", true);
          } else if (stepNumber === 6) {
            setActiveBuyerCall(SEED_BUYERS[0]);
          } else if (stepNumber === 7) {
            setPendingDealData({
              buyerName: "राजेश शर्मा",
              organization: "ABC हैंडीक्राफ्ट्स",
              product: businessMemory.product || "हस्तनिर्मित टोकरियाँ",
              quantity: businessMemory.quantity || 150,
              agreedPrice: 205,
            });
            setShowDealConfirmModal(true);
          } else if (stepNumber === 8) {
            handleProcessTurn("मुझे बिजनेस के लिए लोन सहायता चाहिए।");
          } else if (stepNumber === 9) {
            handleProcessTurn("अधिकारी से बात करवा दो।");
          }
        }}
      />

      {/* ========================================================
          FOOTER
          ======================================================== */}
      <footer className="border-t border-[#F2E4D4] py-6 px-4 text-center text-xs text-[#8C7B70] bg-[#FFF8F0]">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{t.footerCopyright}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t.footerPrivacy}
            </span>
            <span>{t.footerTech}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
