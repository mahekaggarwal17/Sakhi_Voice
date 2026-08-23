# Sakhi Voice (सखी वॉयस) — Voice-First Rural Women Business Agent

> **"Don't make rural women learn another complicated digital platform. Let them simply talk to their business agent."**

**Sakhi Voice** is a voice-first conversational AI business agent built specifically for rural women entrepreneurs (artisans, self-help group members, and smallholder producers) for the **AI for Agriculture & Rural Communities** hackathon problem statement.

Powered by **Agora Conversational AI & WebRTC**, Sakhi Voice enables rural women to discover fair market prices, match with bulk commercial buyers, conduct real-time voice negotiations, and escalate to NGO micro-grant schemes—all through natural spoken Hinglish and regional voice interaction with zero typing required.

---

## 🌟 Key Conversational AI Capabilities Demonstrated

1. **Barge-in / Interruption:** Interrupt Sakhi mid-sentence at any time (*"Ruko, quantity actually 120 hai"*); Sakhi immediately halts and updates its internal state.
2. **Session Memory:** Persistent structured entity tracking (Product, Quantity, Variety, Pricing, Matched Buyers, Deal Status) across the entire session.
3. **Dynamic Questioning:** Instead of rigid questionnaires, Sakhi identifies only missing attributes and dynamically tailors its questions.
4. **Code-Switching (Hinglish):** Natural combination of Hindi + English (*"Mere paas 100 handmade baskets hain and I want to sell in bulk"*).
5. **Correction Recovery:** Corrects previously provided quantities and details on the fly.
6. **External Tool Execution:** Context-aware triggers for mandi pricing, buyer matching, deal recording, and NGO support cases.
7. **Uncertainty & Truthfulness:** Clearly distinguishes verified wholesale market bounds from AI estimates and guarantees.
8. **Human-in-the-Loop Safety:** Explicit confirmation required before finalizing any commercial deal.
9. **Zero-Repetition Human Escalation:** Transfers structured case files and full conversation summaries directly to human counselors.

---

## 🏗️ Technical Architecture

```
                                  ┌───────────────────────────────┐
                                  │      Rural Entrepreneur       │
                                  │  (Natural Spoken Hinglish)    │
                                  └───────────────┬───────────────┘
                                                  │ (Live Voice)
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   Agora WebRTC Audio Pipeline   │
                                 │   (AEC, ANS Noise Suppression)  │
                                 └────────────────┬────────────────┘
                                                  │
                ┌─────────────────────────────────┴─────────────────────────────────┐
                │                                                                   │
                ▼                                                                   ▼
┌───────────────────────────────┐                                 ┌───────────────────────────────────┐
│     Sakhi Conversational AI   │                                 │     Live Agora RTC Voice Call     │
│   (Dynamic Questions, Memory) │                                 │   (Entrepreneur ↔ Buyer Rajesh)   │
└───────────────┬───────────────┘                                 └───────────────────────────────────┘
                │
                ├──► getMarketPrice()     ──► Mandi & Handicraft Index (NHDP Verified)
                ├──► findBuyers()          ──► Verified Commercial Buyer Registry
                ├──► createDeal()          ──► Human Confirmation Guard & Database
                ├──► findSupportOptions()  ──► NGO & NABARD SHG Grant Schemes
                └──► createSupportCase()   ──► Zero-Repetition Structured Handover
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### 2. Installation
```bash
git clone <repository-url>
cd sakhi-voice
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# 1. Agora Project Credentials
AGORA_APP_ID="b6bfc5ea3dac445cb951beb9d373ddc5"
AGORA_APP_CERTIFICATE="c7d61b3b003f4f5d97f40c783f37116d"

# 2. Agora REST API Management
AGORA_CUSTOMER_ID="4484034496dd4b56bf6e53d2d8a195cc"
AGORA_CUSTOMER_SECRET="ae3b66db366744b88e51df1f32d3a2e1"

# 3. Public App Variables
NEXT_PUBLIC_AGORA_APP_ID="b6bfc5ea3dac445cb951beb9d373ddc5"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎬 9-Step Winning Demo Scenario (For Judges)

The application includes an interactive **"Judge Demo Guide"** button in the top header. You can execute the entire journey step-by-step:

1. **Step 1 — Product Discovery:** User speaks: *"Mere paas 100 handmade baskets hain aur mujhe bechna hai."*
2. **Step 2 — Interruption (Barge-in):** User interrupts: *"Ruko, quantity actually 120 hai."* State updates to 120.
3. **Step 3 — Market Price Intelligence:** User asks: *"Market mein iska kya rate chal raha hai?"* Sakhi retrieves verified ₹180–₹230 range from NHDP.
4. **Step 4 — Buyer Discovery:** User says: *"Buyer dhoondo."* Sakhi matches 3 buyers; Rajesh Sharma highlighted.
5. **Step 5 — Live Agora Voice Call:** User says: *"Is buyer se baat karwao."* Connects over real-time Agora RTC voice channel.
6. **Step 6 — Live Negotiation:** Buyer offers ₹190; entrepreneur counters with ₹205; buyer accepts.
7. **Step 7 — Explicit Deal Confirmation:** Safety modal prompts for confirmation; deal recorded in database.
8. **Step 8 — Business Support:** User asks: *"Mujhe business expand karne ke liye financial support chahiye."*
9. **Step 9 — Human Escalation:** Structured case file `#CASE-SKH` generated and dispatched to counselor Priya Sharma with zero repetition.

---

## 📂 Project Structure

```
sakhi-voice/
├── app/
│   ├── api/
│   │   ├── agora/token/route.ts   # Secure Agora RTC token generator
│   │   ├── agent/route.ts         # Conversational AI & tool pipeline
│   │   ├── market/route.ts        # Market pricing intelligence API
│   │   ├── buyers/route.ts        # Buyer discovery API
│   │   ├── deals/route.ts         # Guarded deal recording API
│   │   └── support/route.ts       # NGO discovery & escalation API
│   ├── layout.tsx
│   ├── page.tsx                   # Main Sakhi Voice dashboard
│   └── globals.css
├── components/
│   ├── Header.tsx                 # Header & Agora Engine status
│   ├── VoiceController.tsx        # Tactile mic, barge-in, & status
│   ├── AudioWaveform.tsx          # Real-time Web Audio API visualizer
│   ├── BusinessSnapshot.tsx       # Session memory & entity tracker HUD
│   ├── ConversationTranscript.tsx # Bilingual turn dialogue transcript
│   ├── ToolExecutionBadge.tsx     # External action status banner
│   ├── MarketIntelligenceCard.tsx # Verified market pricing bounds
│   ├── BuyerDiscoveryList.tsx     # Matching buyers & call triggers
│   ├── BuyerCallModal.tsx         # Agora RTC Live negotiation call
│   ├── DealConfirmModal.tsx       # Human confirmation guard modal
│   ├── NgoSupportCard.tsx         # NGO & micro-grant schemes
│   ├── CaseEscalationModal.tsx    # Structured case file & counselor call
│   └── DemoScenarioGuide.tsx      # 9-step judge demo script drawer
├── lib/
│   ├── agora/
│   │   ├── agoraToken.ts          # Server-side token generator
│   │   └── rtcClient.ts           # Agora RTC Web client manager
│   ├── agent/
│   │   ├── agentEngine.ts         # Dynamic questioning & intent router
│   │   ├── conversationState.ts   # Structured memory model
│   │   └── tools.ts               # Core agent tools
│   └── data/
│       ├── seedMarket.ts          # Mandi & artisan price database
│       ├── seedBuyers.ts          # Verified buyers & negotiation scripts
│       └── seedSupport.ts         # NGOs & SHG micro-grant programs
├── .env.example
├── .env.local
└── README.md
```

---

## 🛡️ Judging Criteria Alignment

| Criteria | Weight | How Sakhi Voice Wins |
| :--- | :--- | :--- |
| **Voice-Native Experience** | **25%** | Voice is the central interaction surface, not a decorative widget. |
| **Conversational AI Depth** | **20%** | Full support for interruption/barge-in, dynamic questioning, memory, and code-switching. |
| **Innovation** | **20%** | Transforms voice into an economic empowerment ecosystem for rural micro-entrepreneurs. |
| **Technical Implementation** | **15%** | Deep Agora RTC & Conversational AI integration, secure tokens, Web Audio visualizers. |
| **Real-World Impact** | **10%** | Directly removes digital literacy and middleman barriers for rural women artisans. |
| **Safety & Human Control** | **5%** | Explicit confirmation before commercial deals and full context human escalation. |
| **Demo Experience** | **5%** | Deterministic 9-step judge demo guide with instant audio playback. |
