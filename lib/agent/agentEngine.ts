import { BusinessMemoryState, INITIAL_BUSINESS_MEMORY, updateMissingFields } from "./conversationState";
import {
  executeGetMarketPrice,
  executeFindBuyers,
  executeCreateDeal,
  executeFindSupportOptions,
  executeCreateSupportCase,
  ToolExecutionResult,
} from "./tools";

export interface AgentTurnResponse {
  spokenTextHindi: string;
  spokenTextDevanagari: string;
  spokenTextEnglish: string;
  updatedMemory: BusinessMemoryState;
  executedTool: ToolExecutionResult | null;
  conversationPhase: BusinessMemoryState["conversationPhase"];
  actionTrigger?: string;
  interruptedTurn?: boolean;
}

export function processUserVoiceInput(
  rawInput: string,
  currentState: BusinessMemoryState,
  isInterruption: boolean = false
): AgentTurnResponse {
  const input = rawInput.trim();
  const lower = input.toLowerCase();
  const nextState: BusinessMemoryState = JSON.parse(JSON.stringify(currentState));

  let executedTool: ToolExecutionResult | null = null;
  let responseHindi = "";
  let responseDevanagari = "";
  let responseEnglish = "";

  // 1. CORRECTION / BARGE-IN RECOVERY (e.g., "Actually 150 hain", "Ruko, 120 hain", "Actually mere paas 150 baskets hain")
  const numberMatch = input.match(/\b(\d{2,4})\b/);
  const isCorrection =
    lower.includes("actually") ||
    lower.includes("ruko") ||
    lower.includes("nahi") ||
    lower.includes("change") ||
    lower.includes("wait") ||
    isInterruption;

  if (numberMatch && (isCorrection || (nextState.quantity && parseInt(numberMatch[1], 10) !== nextState.quantity))) {
    const newQty = parseInt(numberMatch[1], 10);
    if (!isNaN(newQty)) {
      nextState.quantity = newQty;
      nextState.missingFields = updateMissingFields(nextState);

      responseHindi = `Achha, ${newQty} hain. Got it. Main updated quantity ke basis par buyers check karti hoon.`;
      responseDevanagari = `अच्छा, ${newQty} हैं। गॉट इट। मैं अपडेटेड क्वांटिटी के बेसिस पर बायर्स चेक करती हूँ।`;
      responseEnglish = `Got it, ${newQty} units. I'll search buyers based on the updated quantity.`;

      // Automatically execute buyer discovery for the updated quantity if in progress
      executedTool = executeFindBuyers(nextState.product || "Handmade Basket", newQty);
      nextState.conversationPhase = "BUYER_DISCOVERY";

      return {
        spokenTextHindi: responseHindi,
        spokenTextDevanagari: responseDevanagari,
        spokenTextEnglish: responseEnglish,
        updatedMemory: nextState,
        executedTool,
        conversationPhase: nextState.conversationPhase,
        interruptedTurn: true,
      };
    }
  }

  // 2. PRODUCT & ATTRIBUTE EXTRACTION
  if (lower.includes("basket") || lower.includes("tokri")) {
    nextState.product = "Handmade Basket";
    nextState.productionType = "handmade";
  } else if (lower.includes("honey") || lower.includes("shahad")) {
    nextState.product = "Pure Organic Honey";
    nextState.productionType = "farm_harvested";
  } else if (lower.includes("dupatta") || lower.includes("chunni") || lower.includes("cloth")) {
    nextState.product = "Handwoven Cotton Dupatta";
    nextState.productionType = "handmade";
  } else if (lower.includes("haldi") || lower.includes("turmeric")) {
    nextState.product = "Organic Turmeric Powder";
    nextState.productionType = "organic";
  } else if (lower.includes("diya") || lower.includes("mitti") || lower.includes("pottery")) {
    nextState.product = "Terracotta Clay Diyas";
    nextState.productionType = "handmade";
  } else if (lower.includes("jute") || lower.includes("bag") || lower.includes("thaila")) {
    nextState.product = "Eco-Friendly Jute Bags";
    nextState.productionType = "handmade";
  }

  // Material & Location Extraction
  if (lower.includes("noida") || lower.includes("delhi") || lower.includes("jaipur") || lower.includes("lucknow")) {
    if (lower.includes("noida")) nextState.location = "Greater Noida";
    else if (lower.includes("jaipur")) nextState.location = "Jaipur";
    else if (lower.includes("delhi")) nextState.location = "Delhi NCR";
  }

  // Selling intent extraction
  if (lower.includes("bulk")) {
    nextState.sellingIntent = "bulk";
  } else if (lower.includes("local")) {
    nextState.sellingIntent = "retail";
  }

  // Quantity extraction if not yet set
  if (numberMatch && !nextState.quantity) {
    nextState.quantity = parseInt(numberMatch[1], 10);
  }

  nextState.missingFields = updateMissingFields(nextState);

  // 3. INTENT: SPECIFIC QUESTION FLOWS (Human & Conversational)

  // A. User answers "Bulk mein" or "Bulk"
  if (
    (lower === "bulk" || lower === "bulk mein" || lower.includes("bulk mein")) &&
    nextState.conversationPhase === "PRODUCT_DISCOVERY"
  ) {
    nextState.sellingIntent = "bulk";
    responseHindi = `Theek hai. Main bulk buyers check kar sakti hoon. Aap kis area se hain?`;
    responseDevanagari = `ठीक है। मैं बल्क बायर्स चेक कर सकती हूँ। आप किस एरिया से हैं?`;
    responseEnglish = `Great. I can check bulk buyers. Which location or area are you from?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool: null,
      conversationPhase: "PRODUCT_DISCOVERY",
    };
  }

  // B. User states location (e.g. "Greater Noida", "Jaipur")
  if (
    (lower.includes("greater noida") || lower.includes("noida") || lower.includes("jaipur") || lower.includes("delhi")) &&
    nextState.conversationPhase === "PRODUCT_DISCOVERY"
  ) {
    nextState.location = "Greater Noida";
    responseHindi = `Got it. Pehle market rate check karun?`;
    responseDevanagari = `गॉट इट। पहले मार्केट रेट चेक करूँ?`;
    responseEnglish = `Got it. Shall I check current market rates first?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool: null,
      conversationPhase: "MARKET_CHECK",
    };
  }

  // C. Market Price Query ("Market rate kya chal raha hai", "Haan", "rate check karo", "price", "mandi rate")
  if (
    lower.includes("rate") ||
    lower.includes("price") ||
    lower.includes("market") ||
    lower.includes("bhav") ||
    lower.includes("bhaav") ||
    (nextState.conversationPhase === "MARKET_CHECK" && (lower === "haan" || lower.includes("haan") || lower === "yes" || lower.includes("check karo")))
  ) {
    executedTool = executeGetMarketPrice(
      nextState.product || "Handmade Basket",
      nextState.location || undefined,
      nextState.quantity || undefined
    );
    nextState.conversationPhase = "MARKET_CHECK";

    if (executedTool.data) {
      nextState.marketPriceRange = {
        min: executedTool.data.minPrice,
        max: executedTool.data.maxPrice,
        suggested: executedTool.data.suggestedNegotiationStart,
        source: executedTool.data.verifiedSource,
        confidence: executedTool.data.confidence,
      };
    }

    responseHindi = `Abhi jo data mila hai, uske hisaab se rate around ₹${executedTool.data?.minPrice || 180} se ₹${executedTool.data?.maxPrice || 220} per basket hai. Kya main buyers check karun?`;
    responseDevanagari = `अभी जो डेटा मिला है, उसके हिसाब से रेट अराउंड ₹${executedTool.data?.minPrice || 180} से ₹${executedTool.data?.maxPrice || 220} प्रति बास्केट है। क्या मैं बायर्स चेक करूँ?`;
    responseEnglish = `Current market rate is around ₹${executedTool.data?.minPrice || 180} to ₹${executedTool.data?.maxPrice || 220} per unit. Shall I search buyers?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: nextState.conversationPhase,
    };
  }

  // D. Buyer Discovery ("Buyer dhoondo", "buyer chahiye", "kisko bechu", "find buyers", "buyers check karo")
  if (
    lower.includes("buyer") ||
    lower.includes("kharidar") ||
    lower.includes("kharidaar") ||
    lower.includes("bechna") ||
    lower.includes("sell") ||
    (nextState.conversationPhase === "MARKET_CHECK" && (lower.includes("haan") || lower.includes("yes") || lower.includes("dhoondo")))
  ) {
    executedTool = executeFindBuyers(nextState.product || "Handmade Basket", nextState.quantity || 150);
    nextState.conversationPhase = "BUYER_DISCOVERY";

    if (executedTool.data && Array.isArray(executedTool.data)) {
      nextState.matchedBuyers = executedTool.data.map((b: any) => ({
        id: b.id,
        name: b.name,
        organization: b.organization,
        offeredPrice: b.initialOfferPrice,
        location: b.location,
        status: b.availabilityStatus,
      }));
    }

    responseHindi = `Ek achha bulk buyer mila hai — Rajesh Sharma. Ye bulk mein handmade baskets le rahe hain. Kya main aapki baat karwa doon?`;
    responseDevanagari = `एक अच्छा बल्क बायर मिला है — राजेश शर्मा। ये बल्क में हैंडमेड बास्केट्स ले रहे हैं। क्या मैं आपकी बात करवा दूँ?`;
    responseEnglish = `Found a good bulk buyer, Rajesh Sharma. Would you like me to connect you with him?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: nextState.conversationPhase,
    };
  }

  // E. Connect to Buyer Call ("Baat karwao", "Call buyer", "Connect karo", "Haan", "Rajesh se baat karwao")
  if (
    lower.includes("baat karwao") ||
    lower.includes("call") ||
    lower.includes("connect") ||
    lower.includes("talk to") ||
    lower.includes("rajesh") ||
    (nextState.conversationPhase === "BUYER_DISCOVERY" && (lower.includes("haan") || lower.includes("yes") || lower.includes("karwa do")))
  ) {
    nextState.conversationPhase = "NEGOTIATION";
    nextState.activeNegotiation.buyerId = "buyer-abc-01";
    nextState.activeNegotiation.buyerName = "Rajesh Sharma (ABC Handicrafts)";
    nextState.activeNegotiation.status = "CALLING";

    responseHindi = `Okay, main aapko buyer se connect karti hoon.`;
    responseDevanagari = `ओके, मैं आपको बायर से कनेक्ट करती हूँ।`;
    responseEnglish = `Okay, connecting you directly with the buyer.`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool: {
        toolName: "startAgoraBuyerCall",
        status: "SUCCESS",
        summaryHindi: "Buyer call connected via Agora RTC.",
        summaryDevanagari: "बायर कॉल कनेक्ट हो गई है।",
        summaryEnglish: "Agora Voice channel connecting entrepreneur with buyer.",
        data: { channelName: `sakhi-buyer-deal-${Date.now()}` },
        actionRequired: "START_CALL",
      },
      conversationPhase: "NEGOTIATION",
      actionTrigger: "OPEN_CALL_MODAL",
    };
  }

  // F. Deal Confirmation ("Haan deal confirm kar do", "Confirm", "Pakki", "Theek hai")
  if (
    nextState.conversationPhase === "NEGOTIATION" &&
    (lower.includes("haan") ||
      lower.includes("yes") ||
      lower.includes("confirm") ||
      lower.includes("pakki") ||
      lower.includes("theek hai") ||
      lower.includes("record"))
  ) {
    executedTool = executeCreateDeal(
      "buyer-abc-01",
      nextState.product || "Handmade Baskets",
      nextState.quantity || 150,
      nextState.activeNegotiation.agreedFinalPrice || 205,
      true
    );

    nextState.conversationPhase = "DEAL_CONFIRMATION";
    nextState.activeNegotiation.status = "CONFIRMED";

    responseHindi = `Deal confirm ho gayi hai! Order database mein record ho gaya. Kya aapko production badhane ke liye koi loan ya support chahiye?`;
    responseDevanagari = `डील कन्फर्म हो गई है! आर्डर डेटाबेस में रिकॉर्ड हो गया। क्या आपको प्रोडक्शन बढ़ाने के लिए कोई लोन या सपोर्ट चाहिए?`;
    responseEnglish = `Deal confirmed and recorded! Would you also like to explore financial grants or loan support?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: "DEAL_CONFIRMATION",
    };
  }

  // G. Business Support / Loan / NGO ("Loan chahiye", "Financial support", "Business expand karna hai", "NGO", "Grant")
  if (
    lower.includes("support") ||
    lower.includes("loan") ||
    lower.includes("paise") ||
    lower.includes("financial") ||
    lower.includes("expand") ||
    lower.includes("sahayata") ||
    lower.includes("ngo") ||
    lower.includes("grant") ||
    lower.includes("madad")
  ) {
    executedTool = executeFindSupportOptions(input);
    nextState.conversationPhase = "BUSINESS_SUPPORT";
    nextState.supportRequirement.needed = true;
    nextState.supportRequirement.purpose = "Production Capacity Expansion & Raw Materials";
    nextState.supportRequirement.requestedAmount = "₹50,000";

    responseHindi = `Achha. Aap business expand karne ke liye support chahti hain? Ek support organization mili hai jo women entrepreneurs ke saath kaam karti hai — Sakhi Foundation. Kya main unse connect kar doon?`;
    responseDevanagari = `अच्छा, आप बिज़नेस एक्सपैंड करने के लिए सपोर्ट चाहती हैं? एक सपोर्ट आर्गेनाइजेशन मिली है जो विमेन एंटरप्रेन्योर्स के साथ काम करती है — सखी फाउंडेशन। क्या मैं उनसे कनेक्ट कर दूँ?`;
    responseEnglish = `Got it. An organization supporting women entrepreneurs is available. Would you like me to connect you with them?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: "BUSINESS_SUPPORT",
    };
  }

  // H. Human Escalation ("Counselor se baat karwao", "Person se baat karni hai", "Haan", "Connect karo")
  if (
    nextState.conversationPhase === "BUSINESS_SUPPORT" ||
    lower.includes("escalate") ||
    lower.includes("counselor") ||
    lower.includes("human") ||
    lower.includes("person") ||
    lower.includes("case") ||
    (nextState.supportRequirement.needed &&
      (lower.includes("haan") || lower.includes("yes") || lower.includes("connect") || lower.includes("karwa do")))
  ) {
    executedTool = executeCreateSupportCase(nextState, "₹50,000", "Production Capacity & Raw Material Expansion");
    nextState.conversationPhase = "HUMAN_ESCALATION";
    nextState.supportRequirement.escalationReady = true;
    nextState.supportRequirement.ngoCaseId = executedTool.data.caseId;
    nextState.supportRequirement.ngoName = executedTool.data.matchedOrganization.name;

    responseHindi = `Is case mein ek person se baat karna better rahega. Main aapki details aur ab tak ki baat unke saath share kar deti hoon, taaki aapko sab kuch dobara na batana pade.`;
    responseDevanagari = `इस केस में एक पर्सन से बात करना बेटर रहेगा। मैं आपकी डिटेल्स और अब तक की बात उनके साथ शेयर कर देती हूँ, ताकि आपको सब कुछ दोबारा ना बताना पड़े।`;
    responseEnglish = `It's best to speak with a representative directly. I'll share your conversation context with them so you won't need to repeat anything.`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextDevanagari: responseDevanagari,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: "HUMAN_ESCALATION",
      actionTrigger: "OPEN_ESCALATION_MODAL",
    };
  }

  // 4. NATURAL CONVERSATIONAL OPENER / DYNAMIC FOLLOW-UP
  if (nextState.product && nextState.quantity) {
    responseHindi = `Achha, ${nextState.quantity} ${nextState.product}. Aap inhe local market mein bechna chahti hain ya bulk mein?`;
    responseDevanagari = `अच्छा, ${nextState.quantity} ${nextState.product}। आप इन्हें लोकल मार्केट में बेचना चाहती हैं या बल्क में?`;
    responseEnglish = `Understood, ${nextState.quantity} ${nextState.product}. Would you like to sell in local markets or to bulk buyers?`;
  } else if (nextState.product && !nextState.quantity) {
    responseHindi = `Achha, ${nextState.product}. Aapke paas kitni quantity available hai?`;
    responseDevanagari = `अच्छा, ${nextState.product}। आपके पास कितनी क्वांटिटी अवेलेबल है?`;
    responseEnglish = `Great, ${nextState.product}. What quantity do you currently have available?`;
  } else {
    responseHindi = `Namaste! Aap kya bechna chahti hain—jaise handmade baskets, honey, ya koi aur product?`;
    responseDevanagari = `नमस्ते! आप क्या बेचना चाहती हैं—जैसे हैंडमेड बास्केट्स, हनी या कोई और प्रोडक्ट?`;
    responseEnglish = `Namaste! What product would you like to sell—such as handmade baskets, honey, or handicrafts?`;
  }

  return {
    spokenTextHindi: responseHindi,
    spokenTextDevanagari: responseDevanagari,
    spokenTextEnglish: responseEnglish,
    updatedMemory: nextState,
    executedTool: null,
    conversationPhase: nextState.conversationPhase,
  };
}
