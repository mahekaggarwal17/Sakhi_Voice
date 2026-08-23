export interface MarketPriceRecord {
  id: string;
  product: string;
  aliases: string[];
  category: "artisan" | "agriculture" | "handicraft" | "textile" | "processed_food";
  minPrice: number;
  maxPrice: number;
  suggestedNegotiationStart: number;
  unit: string;
  verifiedSource: string;
  sourceType: "mandi_api" | "artisan_board" | "cooperative_index" | "verified_traders";
  confidence: "High" | "Medium" | "Verified";
  lastUpdated: string;
  priceTrend: "Rising" | "Stable" | "High Demand";
  descriptionHindi: string;
  descriptionEnglish: string;
  recommendedPackaging: string;
}

export const SEED_MARKET_DATA: MarketPriceRecord[] = [
  {
    id: "prod-basket-01",
    product: "Handmade Basket",
    aliases: ["basket", "tokri", "handmade baskets", "bamboo basket", "cane basket", "tokriyan", "baskets"],
    category: "handicraft",
    minPrice: 180,
    maxPrice: 230,
    suggestedNegotiationStart: 220,
    unit: "per basket",
    verifiedSource: "National Handicrafts Development Programme (NHDP) & Regional Cooperative Registry",
    sourceType: "artisan_board",
    confidence: "Verified",
    lastUpdated: "2026-08-20",
    priceTrend: "High Demand",
    descriptionHindi: "बांस और बेंत की हस्तनिर्मित टोकरियाँ (Handmade Baskets)",
    descriptionEnglish: "Handwoven bamboo and cane utility baskets for urban and export retail",
    recommendedPackaging: "Stacked bundles of 25 with moisture-proof wrapping",
  },
  {
    id: "prod-honey-02",
    product: "Pure Organic Honey",
    aliases: ["honey", "shahad", "organic honey", "madhu", "raw honey", "forest honey"],
    category: "processed_food",
    minPrice: 420,
    maxPrice: 580,
    suggestedNegotiationStart: 550,
    unit: "per kg",
    verifiedSource: "TRIFED Forest Produce Price Index & Khadi Gramodyog Mandi",
    sourceType: "cooperative_index",
    confidence: "Verified",
    lastUpdated: "2026-08-22",
    priceTrend: "Rising",
    descriptionHindi: "शुद्ध प्राकृतिक वन शहद (Raw Natural Honey)",
    descriptionEnglish: "Unprocessed multi-flora raw forest honey harvested by local SHGs",
    recommendedPackaging: "Food-grade sterilized 500g glass jars or 15kg food drums",
  },
  {
    id: "prod-dupatta-03",
    product: "Handwoven Cotton Dupatta",
    aliases: ["dupatta", "chunni", "handloom dupatta", "cotton dupatta", "shawl", "stole", "chanderi dupatta"],
    category: "textile",
    minPrice: 350,
    maxPrice: 480,
    suggestedNegotiationStart: 450,
    unit: "per piece",
    verifiedSource: "Handloom Weavers Federation & Dastkar Artisan Collective",
    sourceType: "artisan_board",
    confidence: "High",
    lastUpdated: "2026-08-19",
    priceTrend: "High Demand",
    descriptionHindi: "हथकरघा सूती दुपट्टा (Natural Dyed Handloom)",
    descriptionEnglish: "Hand-spun natural cotton stoles with vegetable block-print borders",
    recommendedPackaging: "Individual biodegradable poly-packs in cartons of 50",
  },
  {
    id: "prod-turmeric-04",
    product: "Organic Turmeric Powder (Lakadong/Waigaon)",
    aliases: ["turmeric", "haldi", "organic haldi", "haldi powder", "turmeric powder", "lakadong haldi"],
    category: "agriculture",
    minPrice: 190,
    maxPrice: 260,
    suggestedNegotiationStart: 245,
    unit: "per kg",
    verifiedSource: "Agmarknet Spices Board of India Mandi Portal",
    sourceType: "mandi_api",
    confidence: "Verified",
    lastUpdated: "2026-08-23",
    priceTrend: "Stable",
    descriptionHindi: "उच्च करक्यूमिन युक्त जैविक हल्दी पाउडर",
    descriptionEnglish: "High-curcumin (7%+) organically cultivated dried turmeric powder",
    recommendedPackaging: "Double-sealed airtight 1kg pouch packs",
  },
  {
    id: "prod-pottery-05",
    product: "Terracotta Clay Diyas & Pots",
    aliases: ["diya", "diyas", "mitti ke diye", "clay pots", "terracotta", "matka", "pottery"],
    category: "artisan",
    minPrice: 8,
    maxPrice: 15,
    suggestedNegotiationStart: 14,
    unit: "per diya / unit",
    verifiedSource: "State Rural Livelihood Mission (SRLM) Festival Procurement Grid",
    sourceType: "verified_traders",
    confidence: "High",
    lastUpdated: "2026-08-21",
    priceTrend: "High Demand",
    descriptionHindi: "पारंपरिक हस्तनिर्मित मिट्टी के दीये एवं बर्तन",
    descriptionEnglish: "Handcrafted natural terracotta oil lamps and cookware",
    recommendedPackaging: "Straw-padded wooden or cardboard crates of 200 units",
  },
  {
    id: "prod-jute-06",
    product: "Eco-Friendly Jute Shopping Bags",
    aliases: ["jute bag", "jute bags", "thaila", "tote bag", "jute tote", "eco bags"],
    category: "handicraft",
    minPrice: 65,
    maxPrice: 95,
    suggestedNegotiationStart: 90,
    unit: "per bag",
    verifiedSource: "National Jute Board & Fair Trade Alliance",
    sourceType: "cooperative_index",
    confidence: "Verified",
    lastUpdated: "2026-08-22",
    priceTrend: "Stable",
    descriptionHindi: "पर्यावरण-अनुकूल जूट के थैले",
    descriptionEnglish: "Laminated heavy-duty stitched jute market bags with printed motifs",
    recommendedPackaging: "Bales of 100 bags compressed",
  }
];

export function findMarketPrice(productQuery: string): MarketPriceRecord | null {
  const query = productQuery.toLowerCase().trim();
  
  // Exact or alias match
  for (const item of SEED_MARKET_DATA) {
    if (item.product.toLowerCase().includes(query) || query.includes(item.product.toLowerCase())) {
      return item;
    }
    if (item.aliases.some(alias => query.includes(alias) || alias.includes(query))) {
      return item;
    }
  }
  
  // Fuzzy fallback on keywords
  if (query.includes("basket") || query.includes("tokri")) {
    return SEED_MARKET_DATA[0];
  }
  if (query.includes("honey") || query.includes("shahad")) {
    return SEED_MARKET_DATA[1];
  }
  if (query.includes("cloth") || query.includes("dupatta") || query.includes("chunni") || query.includes("handloom")) {
    return SEED_MARKET_DATA[2];
  }
  if (query.includes("haldi") || query.includes("turmeric") || query.includes("masala")) {
    return SEED_MARKET_DATA[3];
  }
  if (query.includes("diya") || query.includes("pot") || query.includes("mitti")) {
    return SEED_MARKET_DATA[4];
  }
  if (query.includes("jute") || query.includes("bag") || query.includes("thaila")) {
    return SEED_MARKET_DATA[5];
  }

  return null;
}
