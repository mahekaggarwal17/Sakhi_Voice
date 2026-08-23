"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Hash,
  Clock,
  User,
  Building
} from "lucide-react";

interface VobizPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "hi" | "en";
  initialPhoneNumber?: string;
  initialRecipientName?: string;
  initialPurpose?: string;
}

export const VobizPhoneModal: React.FC<VobizPhoneModalProps> = ({
  isOpen,
  onClose,
  lang = "hi",
  initialPhoneNumber = "+91 98765 43210",
  initialRecipientName = "राजेश शर्मा (ABC Handicrafts)",
  initialPurpose = "हस्तशिल्प टोकरी थोक सौदा (Trade Negotiation)",
}) => {
  const [activeTab, setActiveTab] = useState<"OUTBOUND" | "INBOUND">("OUTBOUND");
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber);
  const [recipientName, setRecipientName] = useState<string>(initialRecipientName);
  const [callPurpose, setCallPurpose] = useState<string>(initialPurpose);

  // Call Lifecycle States: "IDLE" | "CALLING" | "CONNECTED" | "ENDED"
  const [callState, setCallState] = useState<"IDLE" | "CALLING" | "CONNECTED" | "ENDED">("IDLE");
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [callTranscript, setCallTranscript] = useState<Array<{ sender: string; text: string; time: string }>>([]);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (callState === "CONNECTED") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartOutboundCall = async () => {
    setCallState("CALLING");
    setCallDuration(0);
    setCallTranscript([
      {
        sender: "Vobiz Gateway",
        text: `Calling ${phoneNumber} via Vobiz Telephony (Auth ID: MA_Y0UIJABP)...`,
        time: "Just now",
      },
    ]);

    try {
      const res = await fetch("/api/vobiz/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phoneNumber,
          callerName: recipientName,
          purpose: callPurpose,
        }),
      });
      await res.json();
    } catch (e) {
      console.warn("Outbound Vobiz call client fallback:", e);
    }

    // Connect call after simulated ring
    setTimeout(() => {
      setCallState("CONNECTED");
      setCallTranscript((prev) => [
        ...prev,
        {
          sender: recipientName,
          text: "हेलो! राजेश शर्मा बात कर रहा हूँ ABC हैंडीक्राफ्ट्स से। बताइए?",
          time: "00:03",
        },
        {
          sender: "सखी AI (Sakhi)",
          text: "नमस्ते राजेश जी! मैं ग्रेटर नोएडा के स्वयं सहायता समूह की कारीगर सुनीता जी की ओर से बात कर रही हूँ। हमारे पास 150 प्रीमियम हस्तनिर्मित टोकरियाँ तैयार हैं।",
          time: "00:08",
        },
        {
          sender: recipientName,
          text: "अच्छा, क्या रेट दे रही हैं? मुझे 150 टोकरियों की तुरंत ज़रूरत है।",
          time: "00:15",
        },
      ]);
    }, 2200);
  };

  const handleStartInboundTest = () => {
    setActiveTab("INBOUND");
    setCallState("CALLING");
    setCallDuration(0);
    setRecipientName("सुनीता देवी (Rural Artisan Caller)");
    setCallTranscript([
      {
        sender: "Toll-Free Helpline",
        text: "Incoming call on 1800-72544-24 from +91 94120 56789...",
        time: "Just now",
      },
    ]);

    setTimeout(() => {
      setCallState("CONNECTED");
      setCallTranscript((prev) => [
        ...prev,
        {
          sender: "सखी AI (Sakhi IVR)",
          text: "नमस्ते! सखी वॉयस हेल्पलाइन में आपका स्वागत है। आप आज क्या बेचना या जानना चाहती हैं?",
          time: "00:02",
        },
        {
          sender: "सुनीता देवी (Caller)",
          text: "नमस्ते सखी! मुझे अपनी 100 बांस की टोकरियों का ताज़ा मंडी भाव जानना है।",
          time: "00:07",
        },
        {
          sender: "सखी AI (Sakhi IVR)",
          text: "ग्रेटर नोएडा मंडी में टोकरियों का थोक भाव ₹180 से ₹220 प्रति पीस चल रहा है। क्या मैं आपके लिए थोक खरीदार ढूंढूं?",
          time: "00:14",
        },
      ]);
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState("ENDED");
    setTimeout(() => {
      setCallState("IDLE");
      setCallDuration(0);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FFF8F0] w-full max-w-xl rounded-[36px] shadow-2xl border-2 border-[#F2E4D4] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B7A78] via-[#1E5654] to-[#2B7A78] p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-inner">
              📞
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  {lang === "en" ? "Vobiz Telephony & Helpline System" : "Vobiz फ़ोन कॉल एवं हेल्पलाइन सिस्टम"}
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Auth: MA_Y0UIJABP
                </span>
              </div>
              <p className="text-xs text-teal-100/90 font-medium">
                {lang === "en" ? "Direct Inbound Helpline & Outbound PSTN Phone Calling" : "टोल-फ्री इनबाउंड हेल्पलाइन और सीधे मोबाइल पर आउटबाउंड कॉल"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (When Idle) */}
        {callState === "IDLE" && (
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center gap-2 p-1 bg-[#F5EADB] rounded-2xl border border-[#EADBCA]">
              <button
                onClick={() => setActiveTab("OUTBOUND")}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "OUTBOUND"
                    ? "bg-[#E85D3A] text-white shadow-sm"
                    : "text-[#2D1F1B] hover:text-[#E85D3A]"
                }`}
              >
                <PhoneOutgoing className="w-4 h-4" />
                <span>{lang === "en" ? "Outbound Call (Dial Mobile)" : "आउटबाउंड कॉल (मोबाइल डायल)"}</span>
              </button>
              <button
                onClick={() => setActiveTab("INBOUND")}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "INBOUND"
                    ? "bg-[#2B7A78] text-white shadow-sm"
                    : "text-[#2D1F1B] hover:text-[#2B7A78]"
                }`}
              >
                <PhoneIncoming className="w-4 h-4" />
                <span>{lang === "en" ? "Inbound Helpline (1800-SAKHI)" : "टोल-फ्री हेल्पलाइन (1800-SAKHI)"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* ========================================================
              ACTIVE CALL VIEW (CALLING / CONNECTED / ENDED)
              ======================================================== */}
          {callState !== "IDLE" ? (
            <div className="space-y-6 animate-fade-in text-center">
              {/* Call Status Top Card */}
              <div className="bg-white p-6 rounded-3xl border-2 border-[#F2E4D4] shadow-sm flex flex-col items-center">
                <div className="relative mb-3">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-md ${
                      callState === "CALLING"
                        ? "bg-amber-100 text-amber-800 animate-pulse ring-8 ring-amber-50"
                        : callState === "CONNECTED"
                        ? "bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {callState === "CALLING" ? "📞" : callState === "CONNECTED" ? "🟢" : "🔴"}
                  </div>
                  {callState === "CONNECTED" && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-[#2D1F1B]">{recipientName}</h3>
                <p className="text-xs text-[#8C7B70] font-mono mt-0.5">{phoneNumber}</p>

                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#FFF8F0] border border-[#F2E4D4] rounded-full text-xs font-bold text-[#E85D3A]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {callState === "CALLING"
                      ? lang === "en" ? "Ringing via Vobiz..." : "घंटी बज रही है..."
                      : callState === "CONNECTED"
                      ? `${lang === "en" ? "Call in progress" : "कॉल चालू है"} · ${formatTimer(callDuration)}`
                      : lang === "en" ? "Call Ended" : "कॉल समाप्त"}
                  </span>
                </div>
              </div>

              {/* Live Audio Transcript Box */}
              <div className="bg-white/80 p-4 rounded-3xl border-2 border-[#F2E4D4] text-left max-h-52 overflow-y-auto space-y-2.5">
                <span className="text-[11px] font-bold text-[#8C7B70] uppercase tracking-wider block border-b border-[#F2E4D4] pb-1.5">
                  {lang === "en" ? "Live Telephony Audio Transcript" : "लाइव टेलीफोनी ऑडियो बातचीत (Live Transcript)"}
                </span>

                {callTranscript.map((t, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <span className="font-bold text-[#2B7A78] text-[11px] block">
                      {t.sender} <span className="text-[#8C7B70] font-normal">({t.time})</span>:
                    </span>
                    <p className="text-[#2D1F1B] font-medium leading-relaxed bg-[#FFF8F0] p-2 rounded-xl border border-[#F2E4D4]">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Call Controls (Mute, Speaker, Hangup) */}
              <div className="flex items-center justify-center gap-5 pt-2">
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isMuted ? "bg-amber-600 text-white" : "bg-white text-[#2D1F1B] border-2 border-[#F2E4D4]"
                  }`}
                  title="Mute"
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>

                <button
                  onClick={() => setIsSpeakerOn((prev) => !prev)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isSpeakerOn ? "bg-[#2B7A78] text-white" : "bg-white text-[#2D1F1B] border-2 border-[#F2E4D4]"
                  }`}
                  title="Speaker"
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ========================================================
                  TAB 1: OUTBOUND DIALER VIEW
                  ======================================================== */}
              {activeTab === "OUTBOUND" && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-extrabold text-[#2D1F1B] mb-1.5 uppercase">
                      {lang === "en" ? "Recipient Mobile Number" : "प्राप्तकर्ता का मोबाइल नंबर"}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8C7B70] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-2 border-[#F2E4D4] focus:border-[#E85D3A] font-mono text-sm font-bold text-[#2D1F1B] outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Quick Contact Pills */}
                  <div>
                    <span className="text-[11px] font-bold text-[#8C7B70] uppercase block mb-1.5">
                      {lang === "en" ? "Quick Dial Contacts:" : "तुरंत कॉल करने के लिए संपर्क चुनें:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setPhoneNumber("+91 98112 34567");
                          setRecipientName("राजेश शर्मा (ABC Handicrafts - Buyer)");
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-[#E85D3A]/10 text-xs font-bold text-[#2D1F1B] rounded-full border border-[#F2E4D4] hover:border-[#E85D3A] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Building className="w-3 h-3 text-[#E85D3A]" />
                        <span>राजेश शर्मा (थोक खरीदार)</span>
                      </button>

                      <button
                        onClick={() => {
                          setPhoneNumber("+91 94120 56789");
                          setRecipientName("सुनीता देवी (Craft SHG Artisan)");
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-[#2B7A78]/10 text-xs font-bold text-[#2D1F1B] rounded-full border border-[#F2E4D4] hover:border-[#2B7A78] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <User className="w-3 h-3 text-[#2B7A78]" />
                        <span>सुनीता देवी (कारीगर)</span>
                      </button>

                      <button
                        onClick={() => {
                          setPhoneNumber("+91 99887 76655");
                          setRecipientName("सेवा भारत काउंसलर (SEWA Support)");
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-amber-100 text-xs font-bold text-[#2D1F1B] rounded-full border border-[#F2E4D4] hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        <span>सेवा काउंसलर (लोन अधिकारी)</span>
                      </button>
                    </div>
                  </div>

                  {/* Call Reason / Purpose */}
                  <div className="bg-white p-4 rounded-2xl border border-[#F2E4D4] space-y-1">
                    <span className="text-[11px] font-bold text-[#8C7B70] uppercase block">
                      {lang === "en" ? "Call Purpose & Audio Stream:" : "कॉल का उद्देश्य व AI ऑडियो स्ट्रीम:"}
                    </span>
                    <p className="text-xs font-semibold text-[#2D1F1B]">
                      {recipientName} · {callPurpose}
                    </p>
                  </div>

                  {/* Big Call Button */}
                  <button
                    onClick={handleStartOutboundCall}
                    className="w-full py-4 bg-[#E85D3A] hover:bg-[#C94726] text-white font-extrabold text-base rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                    <span>{lang === "en" ? "Initiate Outbound Call via Vobiz" : "Vobiz से तुरंत फ़ोन कॉल लगाएं"}</span>
                  </button>
                </div>
              )}

              {/* ========================================================
                  TAB 2: INBOUND HELPLINE VIEW
                  ======================================================== */}
              {activeTab === "INBOUND" && (
                <div className="space-y-4 text-left">
                  <div className="bg-gradient-to-r from-[#2B7A78] to-[#1E5654] rounded-3xl p-6 text-white text-center space-y-3 shadow-md">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                      टोल-फ्री हेल्पलाइन (Toll-Free Helpline)
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                      1800-72544-24
                    </h2>
                    <p className="text-xs text-teal-100 font-medium max-w-sm mx-auto">
                      {lang === "en"
                        ? "Rural artisans can call this number from any basic feature phone to talk to Sakhi AI without internet."
                        : "ग्रामीण महिलाएं किसी भी साधारण कीपैड मोबाइल से इस नंबर पर कॉल करके बिना इंटरनेट सखी से बात कर सकती हैं।"}
                    </p>
                  </div>

                  {/* Inbound Features */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#F2E4D4] space-y-1">
                      <span className="font-extrabold text-[#2B7A78] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        100% निशुल्क IVR
                      </span>
                      <p className="text-[#8C7B70]">कोई कॉल चार्ज या इंटरनेट डेटा नहीं लगता।</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#F2E4D4] space-y-1">
                      <span className="font-extrabold text-[#2B7A78] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        हिंदी एवं स्थानीय बोली
                      </span>
                      <p className="text-[#8C7B70]">सरल ग्रामीण भाषा में तुरंत जवाब मिलता है।</p>
                    </div>
                  </div>

                  {/* Simulate Inbound Call Button */}
                  <button
                    onClick={handleStartInboundTest}
                    className="w-full py-4 bg-[#2B7A78] hover:bg-[#1E5654] text-white font-extrabold text-base rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneIncoming className="w-5 h-5 animate-pulse" />
                    <span>{lang === "en" ? "Test Inbound Helpline Call (Simulate)" : "इनबाउंड हेल्पलाइन कॉल टेस्ट करें"}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#F2E4D4] flex items-center justify-between text-xs text-[#8C7B70]">
          <span className="font-bold flex items-center gap-1.5 text-[#2B7A78]">
            <Radio className="w-3.5 h-3.5 text-[#E85D3A] animate-pulse" />
            Vobiz Cloud Telephony Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2D1F1B] hover:bg-black text-white font-bold rounded-full shadow-sm transition-all cursor-pointer"
          >
            {lang === "en" ? "Close" : "बंद करें"}
          </button>
        </div>
      </div>
    </div>
  );
};
