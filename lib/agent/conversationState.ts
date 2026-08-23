export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  intent?: string;
  toolCall?: string;
}

export interface BusinessMemoryState {
  // 1. Core Product & Enterprise Attributes
  product: string | null;
  quantity: number | null;
  unit: string | null;
  materialOrVariety: string | null;
  productionType: "handmade" | "organic" | "machine_stitched" | "farm_harvested" | null;
  location: string | null;
  sellingIntent: "bulk" | "retail" | "immediate_cash" | null;
  preferredPrice: number | null;

  // 2. Verified Market Intelligence
  marketPriceRange: {
    min: number;
    max: number;
    suggested: number;
    source: string;
    confidence: string;
  } | null;

  // 3. Matched Buyer Directory
  matchedBuyers: Array<{
    id: string;
    name: string;
    organization: string;
    offeredPrice: number;
    location: string;
    status: string;
  }>;

  // 4. Live Agora Negotiation Room State
  activeNegotiation: {
    buyerId: string | null;
    buyerName: string | null;
    currentBuyerOffer: number | null;
    entrepreneurCounterOffer: number | null;
    agreedFinalPrice: number | null;
    status: "IDLE" | "CALLING" | "OFFER_RECEIVED" | "COUNTER_OFFERED" | "AGREED_PENDING_CONFIRMATION" | "CONFIRMED";
  };

  // 5. NGO & Financial Support Pipeline
  supportRequirement: {
    needed: boolean;
    purpose: string | null;
    requestedAmount: string | null;
    ngoCaseId: string | null;
    ngoName: string | null;
    escalationReady: boolean;
  };

  // 6. Conversational Flow & Session Intelligence
  conversationPhase:
    | "GREETING"
    | "PRODUCT_DISCOVERY"
    | "MARKET_CHECK"
    | "BUYER_DISCOVERY"
    | "NEGOTIATION"
    | "DEAL_CONFIRMATION"
    | "BUSINESS_SUPPORT"
    | "HUMAN_ESCALATION";
  missingFields: string[];
  lastQuestionAsked: string | null; // Tracks previous question for short-answer disambiguation
  lastUserIntent: string | null;
  currentGoal: string | null;
  conversationSummary: string;
  conversationHistory: ConversationMessage[];
}

export const INITIAL_BUSINESS_MEMORY: BusinessMemoryState = {
  product: null,
  quantity: null,
  unit: "units",
  materialOrVariety: null,
  productionType: null,
  location: null,
  sellingIntent: null,
  preferredPrice: null,
  marketPriceRange: null,
  matchedBuyers: [],
  activeNegotiation: {
    buyerId: null,
    buyerName: null,
    currentBuyerOffer: null,
    entrepreneurCounterOffer: null,
    agreedFinalPrice: null,
    status: "IDLE",
  },
  supportRequirement: {
    needed: false,
    purpose: null,
    requestedAmount: null,
    ngoCaseId: null,
    ngoName: null,
    escalationReady: false,
  },
  conversationPhase: "GREETING",
  missingFields: ["product", "quantity", "sellingIntent", "location"],
  lastQuestionAsked: "GREETING",
  lastUserIntent: "GREETING",
  currentGoal: "DISCOVER_BUSINESS_NEED",
  conversationSummary: "User started a new business consultation with Sakhi.",
  conversationHistory: [],
};

export function updateMissingFields(state: BusinessMemoryState): string[] {
  const missing: string[] = [];
  if (!state.product) missing.push("product");
  if (!state.quantity) missing.push("quantity");
  if (!state.sellingIntent) missing.push("sellingIntent");
  if (!state.location) missing.push("location");
  return missing;
}

export function generateConversationSummary(state: BusinessMemoryState): string {
  const parts: string[] = [];
  if (state.product) {
    parts.push(`Product: ${state.quantity || "some"} ${state.product}`);
  }
  if (state.location) {
    parts.push(`Location: ${state.location}`);
  }
  if (state.sellingIntent) {
    parts.push(`Intent: ${state.sellingIntent} selling`);
  }
  if (state.marketPriceRange) {
    parts.push(`Market rate: ₹${state.marketPriceRange.min}-₹${state.marketPriceRange.max}`);
  }
  if (state.matchedBuyers.length > 0) {
    parts.push(`Matched Buyer: ${state.matchedBuyers[0].name} (${state.matchedBuyers[0].organization})`);
  }
  if (state.activeNegotiation.status === "CONFIRMED" && state.activeNegotiation.agreedFinalPrice) {
    parts.push(`Deal Confirmed: ₹${state.activeNegotiation.agreedFinalPrice}/unit`);
  }
  if (state.supportRequirement.needed) {
    parts.push(`Support: ${state.supportRequirement.purpose || "Financial Grant & Loan"}`);
  }
  return parts.join(" | ") || "Business session initialized.";
}
