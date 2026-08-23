export interface BusinessMemoryState {
  product: string | null;
  quantity: number | null;
  unit: string | null;
  materialOrVariety: string | null;
  productionType: "handmade" | "organic" | "machine_stitched" | "farm_harvested" | null;
  location: string | null;
  sellingIntent: "bulk" | "retail" | "immediate_cash" | null;
  preferredPrice: number | null;
  marketPriceRange: {
    min: number;
    max: number;
    suggested: number;
    source: string;
    confidence: string;
  } | null;
  matchedBuyers: Array<{
    id: string;
    name: string;
    organization: string;
    offeredPrice: number;
    location: string;
    status: string;
  }>;
  activeNegotiation: {
    buyerId: string | null;
    buyerName: string | null;
    currentBuyerOffer: number | null;
    entrepreneurCounterOffer: number | null;
    agreedFinalPrice: number | null;
    status: "IDLE" | "CALLING" | "OFFER_RECEIVED" | "COUNTER_OFFERED" | "AGREED_PENDING_CONFIRMATION" | "CONFIRMED";
  };
  supportRequirement: {
    needed: boolean;
    purpose: string | null;
    requestedAmount: string | null;
    ngoCaseId: string | null;
    ngoName: string | null;
    escalationReady: boolean;
  };
  conversationPhase: "GREETING" | "PRODUCT_DISCOVERY" | "MARKET_CHECK" | "BUYER_DISCOVERY" | "NEGOTIATION" | "DEAL_CONFIRMATION" | "BUSINESS_SUPPORT" | "HUMAN_ESCALATION";
  missingFields: string[];
}

export const INITIAL_BUSINESS_MEMORY: BusinessMemoryState = {
  product: null,
  quantity: null,
  unit: null,
  materialOrVariety: null,
  productionType: null,
  location: "Jaipur Rural Craft Cluster",
  sellingIntent: "bulk",
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
  missingFields: ["product", "quantity", "materialOrVariety"],
};

export function updateMissingFields(state: BusinessMemoryState): string[] {
  const missing: string[] = [];
  if (!state.product) missing.push("product");
  if (!state.quantity) missing.push("quantity");
  if (!state.materialOrVariety && state.product) missing.push("materialOrVariety");
  return missing;
}
