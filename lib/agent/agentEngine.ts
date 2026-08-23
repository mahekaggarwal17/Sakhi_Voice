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
  let responseEnglish = "";

  // 1. CORRECTION / BARGE-IN RECOVERY: Check for quantity updates
  // e.g. "Ruko, quantity actually 120 hai", "Actually 150 hai", "mere paas 120 hai", "change to 120"
  const numberMatch = input.match(/\b(\d{2,4})\b/);
  const isCorrection = lower.includes("actually") || lower.includes("ruko") || lower.includes("nahi") || lower.includes("change") || isInterruption;

  if (numberMatch && (isCorrection || lower.includes("quantity") || lower.includes("basket") || lower.includes("tokri") || lower.includes("peice") || lower.includes("piece"))) {
    const newQty = parseInt(numberMatch[1], 10);
    if (!isNaN(newQty) && newQty !== nextState.quantity) {
      nextState.quantity = newQty;
      
      if (isCorrection) {
        responseHindi = `Samajh gayi! Maine quantity ko update karke ${newQty} kar diya hai. Ab aage batayein, kya hum iske liye market price check karein ya buyers dhoondein?`;
        responseEnglish = `Understood! I updated the quantity to ${newQty} units. Shall we check current market prices or search matching buyers?`;
        nextState.missingFields = updateMissingFields(nextState);
        return {
          spokenTextHindi: responseHindi,
          spokenTextEnglish: responseEnglish,
          updatedMemory: nextState,
          executedTool: null,
          conversationPhase: nextState.conversationPhase,
          interruptedTurn: true,
        };
      }
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

  // Material extraction
  if (lower.includes("bamboo") || lower.includes("baans") || lower.includes("cane") || lower.includes("bent") || lower.includes("handmade")) {
    nextState.materialOrVariety = "Natural Bamboo & Cane";
  } else if (lower.includes("cotton") || lower.includes("sooti")) {
    nextState.materialOrVariety = "Pure Khadi Cotton";
  }

  // Quantity extraction if not already set
  if (numberMatch && !nextState.quantity) {
    nextState.quantity = parseInt(numberMatch[1], 10);
  }

  nextState.missingFields = updateMissingFields(nextState);

  // 3. INTENT 1: MARKET PRICE QUERY ("rate", "price", "mandi", "market mein kya chal raha hai", "kitne mein bikega")
  if (
    lower.includes("rate") ||
    lower.includes("price") ||
    lower.includes("market") ||
    lower.includes("bhav") ||
    lower.includes("bhaav") ||
    lower.includes("kya mil sakta hai") ||
    lower.includes("kitna milega")
  ) {
    executedTool = executeGetMarketPrice(nextState.product || "Handmade Basket", nextState.location || undefined, nextState.quantity || undefined);
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

    responseHindi = executedTool.summaryHindi + ` Kya main aapko matching bulk buyers se connect karwaun?`;
    responseEnglish = executedTool.summaryEnglish + ` Would you like me to find verified buyers for you?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: nextState.conversationPhase,
    };
  }

  // 4. INTENT 2: BUYER DISCOVERY ("buyer dhoondo", "buyer chahiye", "kisko bechu", "find buyers", "kharidaar")
  if (
    lower.includes("buyer") ||
    lower.includes("kharidar") ||
    lower.includes("kharidaar") ||
    lower.includes("bechna") ||
    lower.includes("sell") ||
    lower.includes("customer")
  ) {
    executedTool = executeFindBuyers(nextState.product || "Handmade Basket", nextState.quantity || 120);
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

    responseHindi = executedTool.summaryHindi + ` Aap kis buyer se live voice call par baat karna chahti hain? Aap bol sakti hain: "Rajesh Sharma se baat karwao".`;
    responseEnglish = executedTool.summaryEnglish + ` Would you like to start a real-time Agora voice call with Rajesh Sharma?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: nextState.conversationPhase,
    };
  }

  // 5. INTENT 3: INITIATE BUYER CALL ("baat karwao", "call buyer", "talk to buyer", "connect to rajesh")
  if (
    lower.includes("baat karwao") ||
    lower.includes("call") ||
    lower.includes("connect") ||
    lower.includes("talk to") ||
    lower.includes("rajesh")
  ) {
    nextState.conversationPhase = "NEGOTIATION";
    nextState.activeNegotiation.buyerId = "buyer-abc-01";
    nextState.activeNegotiation.buyerName = "Rajesh Sharma (ABC Handicrafts)";
    nextState.activeNegotiation.status = "CALLING";

    responseHindi = `Main ABC Handicrafts ke Rajesh Sharma ji se aapki live voice call connect kar rahi hoon. Ek pal rukiye...`;
    responseEnglish = `Connecting you live with Rajesh Sharma from ABC Handicrafts over Agora Voice. Please hold...`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool: {
        toolName: "startAgoraBuyerCall",
        status: "SUCCESS",
        summaryHindi: "Live Agora Voice Channel initialized. Buyer online.",
        summaryEnglish: "Agora Voice channel connecting entrepreneur with buyer.",
        data: { channelName: `sakhi-buyer-deal-${Date.now()}` },
        actionRequired: "START_CALL",
      },
      conversationPhase: "NEGOTIATION",
      actionTrigger: "OPEN_CALL_MODAL",
    };
  }

  // 6. INTENT 4: DEAL CONFIRMATION / EXTERNAL RECORDING ("haan", "confirm", "deal pakki", "theek hai")
  if (
    nextState.conversationPhase === "NEGOTIATION" &&
    (lower.includes("haan") || lower.includes("yes") || lower.includes("confirm") || lower.includes("pakki") || lower.includes("theek hai") || lower.includes("record"))
  ) {
    executedTool = executeCreateDeal(
      "buyer-abc-01",
      nextState.product || "Handmade Baskets",
      nextState.quantity || 120,
      nextState.activeNegotiation.agreedFinalPrice || 205,
      true // confirmed by user
    );

    nextState.conversationPhase = "DEAL_CONFIRMATION";
    nextState.activeNegotiation.status = "CONFIRMED";

    responseHindi = executedTool.summaryHindi + ` Kya aapko apne business ko badhane ke liye kisi NGO ya sarkari support ki zaroorat hai?`;
    responseEnglish = executedTool.summaryEnglish + ` Would you also like to explore financial assistance or NGO support for expanding production?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: "DEAL_CONFIRMATION",
    };
  }

  // 7. INTENT 5: BUSINESS EXPANSION / NGO SUPPORT ("financial support", "loan", "paise chahiye", "business expand", "sahayata", "ngo")
  if (
    lower.includes("support") ||
    lower.includes("loan") ||
    lower.includes("paise") ||
    lower.includes("financial") ||
    lower.includes("expand") ||
    lower.includes("sahayata") ||
    lower.includes("ngo") ||
    lower.includes("grant") ||
    lower.includes("capacity")
  ) {
    executedTool = executeFindSupportOptions(input);
    nextState.conversationPhase = "BUSINESS_SUPPORT";
    nextState.supportRequirement.needed = true;
    nextState.supportRequirement.purpose = "Production Expansion & Raw Materials";
    nextState.supportRequirement.requestedAmount = "₹50,000";

    responseHindi = executedTool.summaryHindi + ` Kya main aapka structured case banakar Sakhi Foundation ke counselor se live connect kar doon?`;
    responseEnglish = executedTool.summaryEnglish + ` Would you like me to generate a structured case file and escalate to the counselor with full conversation context?`;

    return {
      spokenTextHindi: responseHindi,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: "BUSINESS_SUPPORT",
    };
  }

  // 8. INTENT 6: HUMAN / NGO ESCALATION ("case banao", "human", "counselor se connect karo", "help chahiye")
  if (
    nextState.conversationPhase === "BUSINESS_SUPPORT" ||
    lower.includes("escalate") ||
    lower.includes("counselor") ||
    lower.includes("human") ||
    lower.includes("case") ||
    (nextState.supportRequirement.needed && (lower.includes("haan") || lower.includes("yes") || lower.includes("connect")))
  ) {
    executedTool = executeCreateSupportCase(nextState, "₹50,000", "Business Capacity & Raw Material Expansion");
    nextState.conversationPhase = "HUMAN_ESCALATION";
    nextState.supportRequirement.escalationReady = true;
    nextState.supportRequirement.ngoCaseId = executedTool.data.caseId;
    nextState.supportRequirement.ngoName = executedTool.data.matchedOrganization.name;

    responseHindi = executedTool.summaryHindi;
    responseEnglish = executedTool.summaryEnglish;

    return {
      spokenTextHindi: responseHindi,
      spokenTextEnglish: responseEnglish,
      updatedMemory: nextState,
      executedTool,
      conversationPhase: "HUMAN_ESCALATION",
      actionTrigger: "OPEN_ESCALATION_MODAL",
    };
  }

  // 9. DYNAMIC QUESTIONING FALLBACK (Intelligently asking for missing data)
  if (nextState.missingFields.length > 0) {
    nextState.conversationPhase = "PRODUCT_DISCOVERY";

    if (!nextState.product) {
      responseHindi = `Namaste! Main aapki business agent Sakhi hoon. Aap kya bechna chahti hain—jaise handmade tokriyan, shuddh shahad, hathkargha dupatta, ya koi anya product?`;
      responseEnglish = `Namaste! I am your business agent Sakhi. What product would you like to sell—such as handmade baskets, honey, textiles, or craft items?`;
    } else if (!nextState.quantity) {
      responseHindi = `Bahut badhiya! Aapke paas ${nextState.product} ki kitni quantity ready hai bechne ke liye?`;
      responseEnglish = `Great! What quantity of ${nextState.product} do you currently have available for sale?`;
    } else if (!nextState.materialOrVariety) {
      responseHindi = `Theek hai, ${nextState.quantity} ${nextState.product}. Ye kis material ya variety ki hain—jaise bamboo ya natural cane?`;
      responseEnglish = `Understood, ${nextState.quantity} units of ${nextState.product}. What material or craft variety is used—such as natural bamboo or cane?`;
    } else {
      responseHindi = `Maine aapke ${nextState.quantity} ${nextState.product} ki details record kar li hain. Kya aap market rate dekhna chahti hain ya direct buyers dhoondein?`;
      responseEnglish = `I have noted your ${nextState.quantity} units of ${nextState.product}. Would you like to check the market price or search buyers?`;
    }
  } else {
    responseHindi = `Main aapke ${nextState.quantity || 100} ${nextState.product || "products"} ke liye tayyar hoon. Aap bol sakti hain: "Market rate batao" ya "Buyer dhoondo".`;
    responseEnglish = `I am ready with your ${nextState.quantity || 100} units of ${nextState.product || "products"}. You can say: "Get market rate" or "Find buyers".`;
  }

  return {
    spokenTextHindi: responseHindi,
    spokenTextEnglish: responseEnglish,
    updatedMemory: nextState,
    executedTool: null,
    conversationPhase: nextState.conversationPhase,
  };
}
