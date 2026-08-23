import {
  BusinessMemoryState,
  INITIAL_BUSINESS_MEMORY,
  updateMissingFields,
  generateConversationSummary,
  ConversationMessage,
} from "./conversationState";
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
  const input = (rawInput || "").trim();
  const lower = input.toLowerCase();
  const nextState: BusinessMemoryState = JSON.parse(JSON.stringify(currentState || INITIAL_BUSINESS_MEMORY));

  // Append user message to history
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (input) {
    if (!nextState.conversationHistory) nextState.conversationHistory = [];
    nextState.conversationHistory.push({
      role: "user",
      content: input,
      timestamp,
    });
  }

  let executedTool: ToolExecutionResult | null = null;
  let responseHindi = "";
  let responseDevanagari = "";
  let responseEnglish = "";
  let nextQuestionTag: string | null = null;
  let actionTrigger: string | undefined = undefined;

  // =========================================================================
  // 1. CORRECTION / BARGE-IN RECOVERY ("Actually 150 hain", "Ruko 200 hain")
  // =========================================================================
  const numberMatch = input.match(/\b(\d{2,4})\b/);
  const isCorrection =
    lower.includes("actually") ||
    lower.includes("ruko") ||
    lower.includes("nahi") ||
    lower.includes("change") ||
    lower.includes("wait") ||
    input.includes("असल में") ||
    input.includes("रुको") ||
    input.includes("नहीं") ||
    isInterruption;

  if (numberMatch && (isCorrection || (nextState.quantity && parseInt(numberMatch[1], 10) !== nextState.quantity))) {
    const newQty = parseInt(numberMatch[1], 10);
    if (!isNaN(newQty)) {
      nextState.quantity = newQty;
      nextState.missingFields = updateMissingFields(nextState);
      nextState.conversationSummary = generateConversationSummary(nextState);

      responseHindi = `Achha, ${newQty} hain. Got it. Main updated quantity ke basis par buyers check karti hoon.`;
      responseDevanagari = `अच्छा, ${newQty} हैं। गॉट इट। मैं अपडेटेड क्वांटिटी के बेसिस पर बायर्स चेक करती हूँ।`;
      responseEnglish = `Got it, ${newQty} units. I'll search buyers based on the updated quantity.`;

      executedTool = executeFindBuyers(nextState.product || "Handmade Basket", newQty);
      nextState.conversationPhase = "BUYER_DISCOVERY";
      nextState.lastQuestionAsked = "ASK_CONNECT_BUYER";
      nextState.lastUserIntent = "CORRECTION";

      return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "BUYER_DISCOVERY", undefined, true);
    }
  }

  // =========================================================================
  // 2. PRODUCT & ATTRIBUTE EXTRACTION (Slot Filling across turns)
  // =========================================================================
  // Product extraction
  if (
    lower.includes("basket") ||
    lower.includes("tokri") ||
    input.includes("टोकरी") ||
    input.includes("टोकरियां") ||
    input.includes("टोकरियाँ") ||
    input.includes("हस्तशिल्प")
  ) {
    nextState.product = "Handmade Basket";
    nextState.productionType = "handmade";
  } else if (lower.includes("honey") || lower.includes("shahad") || input.includes("शहद")) {
    nextState.product = "Pure Organic Honey";
    nextState.productionType = "farm_harvested";
  } else if (
    lower.includes("dupatta") ||
    lower.includes("chunni") ||
    lower.includes("cloth") ||
    input.includes("दुपट्टा") ||
    input.includes("कपड़ा")
  ) {
    nextState.product = "Handwoven Cotton Dupatta";
    nextState.productionType = "handmade";
  } else if (lower.includes("haldi") || lower.includes("turmeric") || input.includes("हल्दी")) {
    nextState.product = "Organic Turmeric Powder";
    nextState.productionType = "organic";
  } else if (
    lower.includes("diya") ||
    lower.includes("mitti") ||
    lower.includes("pottery") ||
    input.includes("दीया") ||
    input.includes("दीये") ||
    input.includes("मिट्टी")
  ) {
    nextState.product = "Terracotta Clay Diyas";
    nextState.productionType = "handmade";
  } else if (lower.includes("jute") || lower.includes("bag") || input.includes("बैग") || input.includes("थैला")) {
    nextState.product = "Eco-Friendly Jute Bags";
    nextState.productionType = "handmade";
  }

  // Location extraction
  if (
    lower.includes("greater noida") ||
    lower.includes("noida") ||
    lower.includes("delhi") ||
    lower.includes("jaipur") ||
    lower.includes("lucknow") ||
    input.includes("ग्रेटर नोएडा") ||
    input.includes("नोएडा") ||
    input.includes("दिल्ली") ||
    input.includes("जयपुर")
  ) {
    if (lower.includes("noida") || input.includes("नोएडा")) nextState.location = "Greater Noida";
    else if (lower.includes("jaipur") || input.includes("जयपुर")) nextState.location = "Jaipur";
    else if (lower.includes("delhi") || input.includes("दिल्ली")) nextState.location = "Delhi NCR";
    else if (lower.includes("lucknow") || input.includes("लखनऊ")) nextState.location = "Lucknow Cluster";
  }

  // Selling intent extraction
  if (lower.includes("bulk") || input.includes("थोक") || lower.includes("wholesale")) {
    nextState.sellingIntent = "bulk";
  } else if (lower.includes("local") || input.includes("खुदरा") || lower.includes("retail")) {
    nextState.sellingIntent = "retail";
  }

  // Quantity extraction
  if (numberMatch && !nextState.quantity) {
    const qty = parseInt(numberMatch[1], 10);
    if (!isNaN(qty)) nextState.quantity = qty;
  }

  // Check if user answered short quantity e.g. "100", "100 ke around"
  if (nextState.lastQuestionAsked === "ASK_QUANTITY" && numberMatch) {
    nextState.quantity = parseInt(numberMatch[1], 10);
  }

  // Check if user answered short selling intent e.g. "Haan", "Bulk", "Bulk mein"
  if (nextState.lastQuestionAsked === "ASK_SELLING_INTENT") {
    if (lower.includes("haan") || lower.includes("yes") || lower.includes("bulk") || input.includes("हाँ") || input.includes("थोक")) {
      nextState.sellingIntent = "bulk";
    } else if (lower.includes("local") || input.includes("लोकल")) {
      nextState.sellingIntent = "retail";
    }
  }

  // Check if user answered short location e.g. "Greater Noida"
  if (nextState.lastQuestionAsked === "ASK_LOCATION") {
    if (lower.includes("noida") || input.includes("नोएडा")) nextState.location = "Greater Noida";
    else if (lower.includes("jaipur") || input.includes("जयपुर")) nextState.location = "Jaipur";
    else if (lower.includes("delhi") || input.includes("दिल्ली")) nextState.location = "Delhi NCR";
    else if (input.length > 2 && !numberMatch) nextState.location = input;
  }

  nextState.missingFields = updateMissingFields(nextState);
  nextState.conversationSummary = generateConversationSummary(nextState);

  // =========================================================================
  // 3. CONTEXTUAL INTENT ROUTING (Pronouns & Continuity)
  // =========================================================================

  // A. HUMAN ESCALATION / SUMMARY HANDOVER
  if (
    lower.includes("person") ||
    lower.includes("human") ||
    lower.includes("officer") ||
    lower.includes("adhikari") ||
    lower.includes("counselor") ||
    input.includes("अधिकारी") ||
    input.includes("इंसान") ||
    input.includes("व्यक्ति") ||
    (lower.includes("baat karwa do") && lower.includes("insan"))
  ) {
    executedTool = executeCreateSupportCase(
      nextState,
      "₹50,000",
      "Business Consultation & Market Escalation"
    );

    nextState.conversationPhase = "HUMAN_ESCALATION";
    nextState.lastUserIntent = "HUMAN_ESCALATION";

    responseHindi = `Main aapki ab tak ki saari details officer ke saath share kar rahi hoon, taaki aapko dobara na batana pade. Thodi der mein call connect ho jayegi.`;
    responseDevanagari = `मैं आपकी अब तक की सारी डिटेल्स ऑफिसर के साथ शेयर कर रही हूँ, ताकि आपको दोबारा न बताना पड़े। थोड़ी देर में कॉल कनेक्ट हो जाएगी।`;
    responseEnglish = `I am sharing all your business context with the support officer so you don't have to repeat anything. Connecting call shortly.`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "HUMAN_ESCALATION");
  }

  // B. BUSINESS SUPPORT / LOANS / NGO SCHEMES ("Mujhe business expand karne ke liye support chahiye", "Loan chahiye")
  if (
    lower.includes("support") ||
    lower.includes("loan") ||
    lower.includes("grant") ||
    lower.includes("ngo") ||
    lower.includes("expand") ||
    lower.includes("mudra") ||
    lower.includes("sahayata") ||
    lower.includes("paise") ||
    input.includes("लोन") ||
    input.includes("मुद्रा") ||
    input.includes("सहायता") ||
    input.includes("अनुदान") ||
    input.includes("पैसे") ||
    (nextState.lastQuestionAsked === "ASK_SUPPORT_OFFICER" && (lower.includes("haan") || lower.includes("bhej do") || input.includes("हाँ")))
  ) {
    if (nextState.lastQuestionAsked === "ASK_SUPPORT_OFFICER" && (lower.includes("haan") || lower.includes("yes") || lower.includes("bhej do") || input.includes("हाँ") || input.includes("भेज दो"))) {
      executedTool = executeCreateSupportCase(
        nextState,
        "₹50,000",
        "Production Capacity Expansion & Raw Materials"
      );

      nextState.conversationPhase = "BUSINESS_SUPPORT";
      nextState.supportRequirement.escalationReady = true;

      responseHindi = `Case create ho gaya hai aur details SEWA officer ko dispatch kar di gayi hain. Officer jald hi aapse call par sampark karenge.`;
      responseDevanagari = `केस क्रिएट हो गया है और डिटेल्स सेवा ऑफिसर को डिस्पैच कर दी गई हैं। ऑफिसर जल्द ही आपसे कॉल पर संपर्क करेंगे।`;
      responseEnglish = `Case created and dispatched to SEWA officer. They will reach out to you shortly.`;

      return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "BUSINESS_SUPPORT");
    }

    executedTool = executeFindSupportOptions(input || "business expansion loan grant");
    nextState.conversationPhase = "BUSINESS_SUPPORT";
    nextState.supportRequirement.needed = true;
    nextState.supportRequirement.purpose = "Production Capacity Expansion & Raw Materials";
    nextState.lastQuestionAsked = "ASK_SUPPORT_OFFICER";
    nextState.lastUserIntent = "BUSINESS_SUPPORT";

    responseHindi = `SEWA Bharat aur Mudra Yojana ke options available hain — ₹50,000 grant aur easy loans. Kya main SEWA officer ko details bhej doon?`;
    responseDevanagari = `सेवा भारत और मुद्रा योजना के ऑप्शन्स उपलब्ध हैं — ₹50,000 ग्रांट और आसान लोन। क्या मैं सेवा ऑफिसर को डिटेल्स भेज दूँ?`;
    responseEnglish = `SEWA Bharat grant and Mudra loan available. Shall I submit your case details to the SEWA officer?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "BUSINESS_SUPPORT");
  }

  // C. DEAL CONFIRMATION ("Deal confirm kar do", "Haan pakki", "Haan", "Confirm")
  if (
    (nextState.conversationPhase === "NEGOTIATION" || nextState.lastQuestionAsked === "ASK_CONFIRM_DEAL" || lower.includes("deal")) &&
    (lower.includes("haan") ||
      lower.includes("yes") ||
      lower.includes("confirm") ||
      lower.includes("pakki") ||
      lower.includes("theek hai") ||
      input.includes("हाँ") ||
      input.includes("पक्की") ||
      input.includes("डील"))
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
    nextState.lastQuestionAsked = "ASK_POST_DEAL_SUPPORT";
    nextState.lastUserIntent = "DEAL_CONFIRMATION";

    responseHindi = `Deal confirm ho gayi hai! Order database mein record ho gaya. Kya aapko production badhane ke liye koi loan ya support chahiye?`;
    responseDevanagari = `डील कन्फर्म हो गई है! आर्डर डेटाबेस में रिकॉर्ड हो गया। क्या आपको प्रोडक्शन बढ़ाने के लिए कोई लोन या सपोर्ट चाहिए?`;
    responseEnglish = `Deal confirmed and recorded! Would you also like to explore financial grants or loan support?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "DEAL_CONFIRMATION");
  }

  // D. CONNECT TO BUYER AGORA VOICE CALL ("Buyer se baat karwa do", "Call buyer", "Rajesh se baat karwao")
  if (
    lower.includes("baat karwao") ||
    lower.includes("baat karwa do") ||
    lower.includes("call") ||
    lower.includes("connect") ||
    lower.includes("talk to") ||
    lower.includes("rajesh") ||
    input.includes("कॉल") ||
    input.includes("बात करवाओ") ||
    input.includes("बात करवा दो") ||
    input.includes("राजेश") ||
    (nextState.lastQuestionAsked === "ASK_CONNECT_BUYER" && (lower.includes("haan") || lower.includes("yes") || lower.includes("karwa do") || input.includes("हाँ") || input.includes("करवाओ")))
  ) {
    nextState.conversationPhase = "NEGOTIATION";
    nextState.activeNegotiation.buyerId = "buyer-abc-01";
    nextState.activeNegotiation.buyerName = "Rajesh Sharma (ABC Handicrafts)";
    nextState.activeNegotiation.status = "CALLING";
    nextState.lastQuestionAsked = "IN_BUYER_CALL";
    nextState.lastUserIntent = "CONNECT_BUYER";
    actionTrigger = "START_BUYER_CALL";

    responseHindi = `Okay, main aapko buyer se connect karti hoon.`;
    responseDevanagari = `ओके, मैं आपको बायर से कनेक्ट करती हूँ।`;
    responseEnglish = `Connecting you directly with the buyer via Agora Voice.`;

    executedTool = {
      toolName: "startAgoraBuyerCall",
      status: "SUCCESS",
      summaryHindi: "Buyer call connected via Agora RTC.",
      summaryDevanagari: "बायर कॉल कनेक्ट हो गई है।",
      summaryEnglish: "Agora Voice channel connecting entrepreneur with buyer.",
      data: { channelName: `sakhi-buyer-deal-${Date.now()}` },
      actionRequired: "START_CALL",
    };

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "NEGOTIATION", actionTrigger);
  }

  // E. FIND BUYERS ("Buyer dhoondo", "Kharidar dikhao", "Haan buyer check karo")
  if (
    lower.includes("buyer") ||
    lower.includes("kharidar") ||
    lower.includes("kharidaar") ||
    lower.includes("bechna") ||
    lower.includes("sell") ||
    input.includes("खरीदार") ||
    input.includes("व्यापारी") ||
    input.includes("बायर") ||
    (nextState.lastQuestionAsked === "ASK_FIND_BUYERS" && (lower.includes("haan") || lower.includes("yes") || lower.includes("dhoondo") || input.includes("हाँ") || input.includes("दिखाओ")))
  ) {
    executedTool = executeFindBuyers(nextState.product || "Handmade Basket", nextState.quantity || 150);
    nextState.conversationPhase = "BUYER_DISCOVERY";
    nextState.lastQuestionAsked = "ASK_CONNECT_BUYER";
    nextState.lastUserIntent = "FIND_BUYER";

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

    responseHindi = `Ek achha bulk buyer mila hai — Rajesh Sharma (ABC Handicrafts). Ye bulk mein handmade baskets le rahe hain. Kya main aapki baat karwa doon?`;
    responseDevanagari = `एक अच्छा बल्क बायर मिला है — राजेश शर्मा (ABC हैंडीक्राफ्ट्स)। ये बल्क में हैंडमेड बास्केट्स ले रहे हैं। क्या मैं आपकी बात करवा दूँ?`;
    responseEnglish = `Found a verified bulk buyer, Rajesh Sharma. Would you like me to connect you with him over call?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "BUYER_DISCOVERY");
  }

  // F. MARKET PRICE QUERY ("Iska market rate kya hai", "Rate kya chal raha hai", "Mandi bhav", "Iska rate", "Price")
  if (
    lower.includes("rate") ||
    lower.includes("price") ||
    lower.includes("market") ||
    lower.includes("bhav") ||
    lower.includes("bhaav") ||
    lower.includes("daam") ||
    input.includes("मंडी") ||
    input.includes("भाव") ||
    input.includes("दाम") ||
    input.includes("रेट") ||
    (nextState.lastQuestionAsked === "ASK_CHECK_MARKET_RATE" &&
      (lower.includes("haan") || lower.includes("yes") || lower.includes("check") || input.includes("हाँ") || input.includes("चेक")))
  ) {
    executedTool = executeGetMarketPrice(
      nextState.product || "Handmade Basket",
      nextState.location || "Greater Noida",
      nextState.quantity || 100
    );
    nextState.conversationPhase = "MARKET_CHECK";
    nextState.lastQuestionAsked = "ASK_FIND_BUYERS";
    nextState.lastUserIntent = "CHECK_MARKET_PRICE";

    if (executedTool.data) {
      nextState.marketPriceRange = {
        min: executedTool.data.minPrice,
        max: executedTool.data.maxPrice,
        suggested: executedTool.data.suggestedNegotiationStart,
        source: executedTool.data.verifiedSource,
        confidence: executedTool.data.confidence,
      };
    }

    const min = nextState.marketPriceRange?.min || 180;
    const max = nextState.marketPriceRange?.max || 220;
    const start = nextState.marketPriceRange?.suggested || 220;

    responseHindi = `Greater Noida mein baskets ka wholesale rate ₹${min} se ₹${max} chal raha hai. Aapko ₹${start} se baat shuru karni chahiye. Kya main verified buyers dhoondun?`;
    responseDevanagari = `ग्रेटर नोएडा में बास्केट्स का होलसेल रेट ₹${min} से ₹${max} चल रहा है। आपको ₹${start} से बात शुरू करनी चाहिए। क्या मैं वेरिफाइड बायर्स ढूंढूं?`;
    responseEnglish = `Wholesale rate is ₹${min} to ₹${max}. Start negotiation at ₹${start}. Shall I search verified buyers?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, executedTool, "MARKET_CHECK");
  }

  // =========================================================================
  // 4. DYNAMIC SINGLE-QUESTIONING (Collect only missing info step-by-step)
  // =========================================================================

  // If product is known but quantity is missing
  if (nextState.product && !nextState.quantity) {
    nextState.conversationPhase = "PRODUCT_DISCOVERY";
    nextState.lastQuestionAsked = "ASK_QUANTITY";

    responseHindi = `Achha. Kitni quantity hai?`;
    responseDevanagari = `अच्छा। कितनी क्वांटिटी है?`;
    responseEnglish = `Nice. What quantity do you have available?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, null, "PRODUCT_DISCOVERY");
  }

  // If product & quantity known, but selling intent is missing
  if (nextState.product && nextState.quantity && !nextState.sellingIntent) {
    nextState.conversationPhase = "PRODUCT_DISCOVERY";
    nextState.lastQuestionAsked = "ASK_SELLING_INTENT";

    responseHindi = `Okay, ${nextState.quantity} ${nextState.product === "Handmade Basket" ? "baskets" : nextState.product}. Aap bulk mein bechna chahti hain ya local market mein?`;
    responseDevanagari = `ओके, ${nextState.quantity} बास्केट्स। आप बल्क में बेचना चाहती हैं या लोकल मार्केट में?`;
    responseEnglish = `Okay, ${nextState.quantity} baskets. Do you want to sell in bulk or local market?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, null, "PRODUCT_DISCOVERY");
  }

  // If product, quantity, sellingIntent known, but location is missing
  if (nextState.product && nextState.quantity && nextState.sellingIntent && !nextState.location) {
    nextState.conversationPhase = "PRODUCT_DISCOVERY";
    nextState.lastQuestionAsked = "ASK_LOCATION";

    responseHindi = `Theek hai. Main bulk buyers ke liye dekh sakti hoon. Aap kis area se hain?`;
    responseDevanagari = `ठीक है। मैं बल्क बायर्स के लिए देख सकती हूँ। आप किस एरिया से हैं?`;
    responseEnglish = `Great. I can check bulk buyers. Which area or district are you from?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, null, "PRODUCT_DISCOVERY");
  }

  // If all 4 core slots are filled! Offer market rate check
  if (nextState.product && nextState.quantity && nextState.sellingIntent && nextState.location && nextState.conversationPhase === "PRODUCT_DISCOVERY") {
    nextState.conversationPhase = "MARKET_CHECK";
    nextState.lastQuestionAsked = "ASK_CHECK_MARKET_RATE";

    responseHindi = `Got it. ${nextState.location} se ${nextState.quantity} ${nextState.product === "Handmade Basket" ? "baskets" : nextState.product}. Pehle market rate check karun?`;
    responseDevanagari = `गॉट इट। ${nextState.location} से ${nextState.quantity} बास्केट्स। पहले मार्केट रेट चेक करूँ?`;
    responseEnglish = `Got it. ${nextState.quantity} baskets in ${nextState.location}. Shall I check current market rates first?`;

    return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, null, "MARKET_CHECK");
  }

  // Default friendly guidance
  nextState.lastQuestionAsked = "GREETING";
  responseHindi = `Namaste Didi! Main aapki Sakhi hoon. Aap kya bechna ya jaanna chahti hain? Jaise baskets, shahad, mandi rate ya loan scheme.`;
  responseDevanagari = `नमस्ते दीदी! मैं आपकी सखी हूँ। आप क्या बेचना या जानना चाहती हैं? जैसे टोकरियां, शहद, मंडी भाव या लोन योजना।`;
  responseEnglish = `Namaste Didi! I am your Sakhi. What would you like to sell or explore today?`;

  return formatResponse(responseHindi, responseDevanagari, responseEnglish, nextState, null, "GREETING");
}

function formatResponse(
  hindi: string,
  devanagari: string,
  english: string,
  state: BusinessMemoryState,
  executedTool: ToolExecutionResult | null,
  phase: BusinessMemoryState["conversationPhase"],
  actionTrigger?: string,
  interruptedTurn: boolean = false
): AgentTurnResponse {
  // Append AI message to history
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (!state.conversationHistory) state.conversationHistory = [];
  state.conversationHistory.push({
    role: "assistant",
    content: hindi,
    timestamp,
    toolCall: executedTool?.toolName,
  });

  return {
    spokenTextHindi: hindi,
    spokenTextDevanagari: devanagari,
    spokenTextEnglish: english,
    updatedMemory: state,
    executedTool,
    conversationPhase: phase,
    actionTrigger,
    interruptedTurn,
  };
}
