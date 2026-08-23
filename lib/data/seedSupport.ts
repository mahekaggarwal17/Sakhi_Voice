export interface SupportOrganization {
  id: string;
  name: string;
  organizationType: "NGO" | "Govt SHG Mission" | "NABARD Partner" | "Micro-Credit Cooperative";
  supportCategory: "Financial Grant & Loan" | "Working Capital" | "Skill & Machine Subsidy" | "Direct Market Linkage";
  maxGrantAmount: string;
  focusArea: string;
  location: string;
  representativeName: string;
  representativeRole: string;
  contactNumber: string;
  agoraEscalationAvailable: boolean;
  eligibilityCriteria: string[];
  descriptionHindi: string;
  descriptionEnglish: string;
}

export const SEED_SUPPORT_ORGS: SupportOrganization[] = [
  {
    id: "ngo-sakhi-01",
    name: "Sakhi Rural Enterprise Foundation",
    organizationType: "NGO",
    supportCategory: "Financial Grant & Loan",
    maxGrantAmount: "₹25,000 – ₹1,00,000",
    focusArea: "Women Artisans & Self-Help Group (SHG) Expansion",
    location: "National Rural Support Grid (All Districts)",
    representativeName: "Priya Sharma",
    representativeRole: "Senior Enterprise Counselor",
    contactNumber: "+91-1800-SAKHI-HELP",
    agoraEscalationAvailable: true,
    eligibilityCriteria: [
      "Woman entrepreneur or registered SHG member",
      "Active production in handicrafts, agriculture, or village enterprise",
      "Requirement for raw materials, machinery, or working capital"
    ],
    descriptionHindi: "महिला उद्यमियों के लिए ब्याज-मुक्त कार्यशील पूंजी सहायता एवं कच्चा माल सहयोग।",
    descriptionEnglish: "Zero-collateral micro-grants and working capital support for rural women craft collectives.",
  },
  {
    id: "ngo-nabard-02",
    name: "NABARD SHG Samriddhi Micro-Finance",
    organizationType: "NABARD Partner",
    supportCategory: "Working Capital",
    maxGrantAmount: "₹50,000 – ₹3,00,000 (Subsidized 4% interest)",
    focusArea: "Micro-machinery, Solar Dryers, Toolkits",
    location: "District Rural Development Agency (DRDA)",
    representativeName: "Rameshwar Patel",
    representativeRole: "District Livelihoods Officer",
    contactNumber: "+91-1800-NABARD-RURAL",
    agoraEscalationAvailable: true,
    eligibilityCriteria: [
      "Minimum 3 months of operational enterprise",
      "Aadhaar card and basic village verification",
      "Group or individual enterprise expansion plan"
    ],
    descriptionHindi: "मशीनरी खरीदने और उत्पादन 3 गुना बढ़ाने के लिए नाबार्ड समर्थित आसान ऋण योजना।",
    descriptionEnglish: "Government-subsidized capital for modern craft machinery, toolkits, and raw inventory.",
  },
  {
    id: "ngo-craft-03",
    name: "Dastkar Mahila Karigar Manch",
    organizationType: "Govt SHG Mission",
    supportCategory: "Direct Market Linkage",
    maxGrantAmount: "₹30,000 Production Advance + Free Exhibition Stalls",
    focusArea: "Handicrafts, Handloom, Pottery & Natural Fibers",
    location: "State Craft Council",
    representativeName: "Anjali Mukherji",
    representativeRole: "Craft Cluster Lead",
    contactNumber: "+91-1800-DASTKAR-ART",
    agoraEscalationAvailable: true,
    eligibilityCriteria: [
      "Handmade product manufacturing",
      "Willingness to participate in urban artisan fairs"
    ],
    descriptionHindi: "शहरी मेलों में सीधे बिना बिचौलिए के स्टॉल लगाने और अग्रिम भुगतान की सुविधा।",
    descriptionEnglish: "Direct market linkage with zero middleman commission and artisan exhibition passes.",
  }
];

export interface SupportCaseRecord {
  caseId: string;
  createdAt: string;
  entrepreneurProfile: {
    product: string;
    currentProduction: string;
    location: string;
  };
  supportRequirement: {
    purpose: string;
    requestedAmount: string;
    supportCategory: string;
  };
  matchedOrganization: SupportOrganization;
  conversationSummary: string;
  verifiedDetails: string[];
  status: "CASE_CREATED" | "DISPATCHED_TO_OFFICER" | "HUMAN_CALL_ACTIVE" | "RESOLVED";
}

export function findSupportOptions(needQuery: string): SupportOrganization[] {
  const query = needQuery.toLowerCase();
  
  if (query.includes("machine") || query.includes("solar") || query.includes("loan")) {
    return [SEED_SUPPORT_ORGS[1], SEED_SUPPORT_ORGS[0], SEED_SUPPORT_ORGS[2]];
  }
  if (query.includes("exhibition") || query.includes("mela") || query.includes("market")) {
    return [SEED_SUPPORT_ORGS[2], SEED_SUPPORT_ORGS[0], SEED_SUPPORT_ORGS[1]];
  }

  return SEED_SUPPORT_ORGS;
}
