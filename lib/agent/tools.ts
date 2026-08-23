import { findMarketPrice, MarketPriceRecord } from "@/lib/data/seedMarket";
import { findMatchingBuyers, BuyerProfile, SEED_BUYERS } from "@/lib/data/seedBuyers";
import { findSupportOptions, SupportOrganization, SupportCaseRecord, SEED_SUPPORT_ORGS } from "@/lib/data/seedSupport";
import { BusinessMemoryState } from "./conversationState";

export interface ToolExecutionResult {
  toolName: string;
  status: "SUCCESS" | "WARNING" | "ERROR";
  summaryHindi: string;
  summaryDevanagari?: string;
  summaryEnglish: string;
  data: any;
  uiActionPrompt?: string;
  actionRequired?: "CONFIRM_DEAL" | "SHOW_MARKET" | "SHOW_BUYERS" | "START_CALL" | "SHOW_SUPPORT" | "ESCALATE";
}

// In-memory persistent storage for deals and cases across session
export const RECORDED_DEALS: Array<{
  dealId: string;
  buyerName: string;
  organization: string;
  product: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  totalValue: number;
  timestamp: string;
  status: "RECORDED_IN_DATABASE";
}> = [];

export const RECORDED_CASES: SupportCaseRecord[] = [];

/**
 * 1. getMarketPrice Tool
 */
export function executeGetMarketPrice(productQuery: string, location?: string, quantity?: number): ToolExecutionResult {
  const result = findMarketPrice(productQuery || "Handmade Basket");

  if (!result) {
    return {
      toolName: "getMarketPrice",
      status: "WARNING",
      summaryHindi: "Is product ka verified rate abhi nahi mil raha hai.",
      summaryDevanagari: "इस प्रोडक्ट का वेरिफाइड रेट अभी नहीं मिल पा रहा है।",
      summaryEnglish: "Verified rate currently unavailable for this specific product.",
      data: null,
    };
  }

  return {
    toolName: "getMarketPrice",
    status: "SUCCESS",
    summaryHindi: `Abhi jo data mila hai, uske hisaab se rate around ₹${result.minPrice} se ₹${result.maxPrice} per ${result.unit.replace("per ", "")} hai.`,
    summaryDevanagari: `अभी जो डेटा मिला है, उसके हिसाब से रेट अराउंड ₹${result.minPrice} से ₹${result.maxPrice} प्रति बास्केट है।`,
    summaryEnglish: `Current verified market range is approximately ₹${result.minPrice} – ₹${result.maxPrice} per unit.`,
    data: result,
    actionRequired: "SHOW_MARKET",
  };
}

/**
 * 2. findBuyers Tool
 */
export function executeFindBuyers(productQuery: string, quantity?: number): ToolExecutionResult {
  const buyers = findMatchingBuyers(productQuery || "Handmade Basket", quantity);

  return {
    toolName: "findBuyers",
    status: "SUCCESS",
    summaryHindi: `Ek achha bulk buyer mila hai — ${buyers[0].name} (${buyers[0].organization}).`,
    summaryDevanagari: `एक अच्छा बल्क बायर मिला है — ${buyers[0].name}।`,
    summaryEnglish: `Found verified bulk buyers. Top match: ${buyers[0].name} (${buyers[0].organization}).`,
    data: buyers,
    actionRequired: "SHOW_BUYERS",
  };
}

/**
 * 3. createDeal Tool (requires explicit human confirmation)
 */
export function executeCreateDeal(
  buyerId: string,
  product: string,
  quantity: number,
  agreedPrice: number,
  confirmedByUser: boolean = false
): ToolExecutionResult {
  const buyer = SEED_BUYERS.find((b) => b.id === buyerId) || SEED_BUYERS[0];
  const totalValue = quantity * agreedPrice;

  if (!confirmedByUser) {
    return {
      toolName: "createDeal",
      status: "WARNING",
      summaryHindi: `Buyer ${buyer.name} ne ₹${agreedPrice} per piece par ${quantity} ${product} ke liye haan bol diya hai. Kya main deal confirm kar doon?`,
      summaryDevanagari: `बायर ${buyer.name} ने ₹${agreedPrice} पर ${quantity} ${product} के लिए हाँ बोल दिया है। क्या मैं डील कन्फर्म कर दूँ?`,
      summaryEnglish: `Buyer agreed to ₹${agreedPrice}/unit for ${quantity} units. Please confirm before saving.`,
      data: {
        buyerId: buyer.id,
        buyerName: buyer.name,
        organization: buyer.organization,
        product,
        quantity,
        agreedPrice,
        totalValue,
      },
      actionRequired: "CONFIRM_DEAL",
    };
  }

  const newDeal = {
    dealId: `DEAL-${Date.now().toString().slice(-4)}`,
    buyerName: buyer.name,
    organization: buyer.organization,
    product,
    quantity,
    unit: "units",
    agreedPrice,
    totalValue,
    timestamp: new Date().toISOString(),
    status: "RECORDED_IN_DATABASE" as const,
  };

  RECORDED_DEALS.push(newDeal);

  return {
    toolName: "createDeal",
    status: "SUCCESS",
    summaryHindi: `Deal confirm ho gayi hai! Order ID ${newDeal.dealId} save kar li hai.`,
    summaryDevanagari: `डील कन्फर्म हो गई है! आर्डर आईडी ${newDeal.dealId} सेव कर ली है।`,
    summaryEnglish: `Deal successfully finalized and stored in database.`,
    data: newDeal,
  };
}

/**
 * 4. findSupportOptions Tool
 */
export function executeFindSupportOptions(needQuery: string): ToolExecutionResult {
  const orgs = findSupportOptions(needQuery || "business expansion");

  return {
    toolName: "findSupportOptions",
    status: "SUCCESS",
    summaryHindi: `Ek support organization mili hai jo women entrepreneurs ke saath kaam karti hai — ${orgs[0].name}.`,
    summaryDevanagari: `एक सपोर्ट आर्गेनाइजेशन मिली है जो विमेन एंटरप्रेन्योर्स के साथ काम करती है — ${orgs[0].name}।`,
    summaryEnglish: `Found support organization: ${orgs[0].name}.`,
    data: orgs,
    actionRequired: "SHOW_SUPPORT",
  };
}

/**
 * 5. createSupportCase Tool & Escalate to Human
 */
export function executeCreateSupportCase(
  state: BusinessMemoryState,
  requestedAmount: string = "₹50,000",
  purpose: string = "Production Capacity Expansion"
): ToolExecutionResult {
  const org = SEED_SUPPORT_ORGS[0];
  const caseId = `CASE-${Date.now().toString().slice(-4)}`;

  const supportCase: SupportCaseRecord = {
    caseId,
    createdAt: new Date().toISOString(),
    entrepreneurProfile: {
      product: state.product || "Handmade Baskets",
      currentProduction: `${state.quantity || 150} units`,
      location: state.location || "Greater Noida",
    },
    supportRequirement: {
      purpose,
      requestedAmount,
      supportCategory: org.supportCategory,
    },
    matchedOrganization: org,
    conversationSummary: `Entrepreneur produces quality ${state.product || "handmade baskets"}. Agreed deal with buyer Rajesh Sharma at ₹205/piece for ${state.quantity || 150} units. Requesting ₹50,000 for expansion.`,
    verifiedDetails: [
      `Product: ${state.product || "Handmade Baskets"}`,
      `Current Order: ${state.quantity || 150} units`,
      `Price: ₹205 agreed deal`,
      `Need: Business Expansion grant`,
    ],
    status: "CASE_CREATED",
  };

  RECORDED_CASES.push(supportCase);

  return {
    toolName: "createSupportCase",
    status: "SUCCESS",
    summaryHindi: `Main aapki details aur ab tak ki baat counselor Priya Sharma se share kar rahi hoon, taaki aapko dobara na batana pade.`,
    summaryDevanagari: `मैं आपकी डिटेल्स और अब तक की बात काउंसलर प्रिया शर्मा से शेयर कर रही हूँ, ताकि आपको दोबारा ना बताना पड़े।`,
    summaryEnglish: `Case details shared with counselor Priya Sharma so you won't need to repeat anything.`,
    data: supportCase,
    actionRequired: "ESCALATE",
  };
}
