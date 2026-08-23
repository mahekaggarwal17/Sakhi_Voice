export interface BuyerProfile {
  id: string;
  name: string;
  organization: string;
  productCategory: string;
  matchedProducts: string[];
  location: string;
  distanceKm: number;
  requiredQuantity: string;
  minQuantity: number;
  maxQuantity: number;
  indicativePriceRange: string;
  initialOfferPrice: number;
  targetMaxPrice: number;
  preferredContact: "Agora Real-time Voice Call" | "Direct Pickup & Call";
  availabilityStatus: "Available Now (Online)" | "Accepting Calls" | "Busy";
  verificationBadge: "Govt Certified Buyer" | "Fair Trade Partner" | "Export Verified";
  rating: number;
  completedDeals: number;
  personality: string;
  greetingHindi: string;
  openingVoiceOfferHindi: string;
  counterResponse1Hindi: string;
  dealAcceptedVoiceHindi: string;
}

export const SEED_BUYERS: BuyerProfile[] = [
  {
    id: "buyer-abc-01",
    name: "Rajesh Sharma",
    organization: "ABC Handicrafts & FabIndia Supplier Network",
    productCategory: "Handmade Baskets & Cane Craft",
    matchedProducts: ["Handmade Basket", "tokri", "cane craft", "bamboo craft"],
    location: "Jaipur Wholesale Hub & Delhi NCR",
    distanceKm: 45,
    requiredQuantity: "100 - 300 baskets",
    minQuantity: 50,
    maxQuantity: 500,
    indicativePriceRange: "₹190 – ₹215 / unit",
    initialOfferPrice: 190,
    targetMaxPrice: 205,
    preferredContact: "Agora Real-time Voice Call",
    availabilityStatus: "Available Now (Online)",
    verificationBadge: "Fair Trade Partner",
    rating: 4.9,
    completedDeals: 142,
    personality: "Professional, respects artisan work, looking for immediate bulk inventory.",
    greetingHindi: "Namaste behenji! Main Rajesh Sharma bol raha hoon ABC Handicrafts se. Humein urgent bulk supply mein 100 se 150 handmade baskets chahiye.",
    openingVoiceOfferHindi: "Market situation dekhte hue main aapko ₹190 per basket ka cash-on-delivery offer de sakta hoon turant.",
    counterResponse1Hindi: "Aapka maal badhiya lag raha hai. Theek hai, main thoda aage badhkar ₹200 tak jaa sakta hoon.",
    dealAcceptedVoiceHindi: "Theek hai behenji, ₹205 per basket par deal pakki karte hain! Hum kal subah gaadi bhej kar pickup kar lenge.",
  },
  {
    id: "buyer-gramin-02",
    name: "Sunita Verma",
    organization: "Gramin Vikas Bazaar Cooperative",
    productCategory: "Handmade Baskets & Jute Bags",
    matchedProducts: ["Handmade Basket", "Jute Bags", "tokri", "jute"],
    location: "Lucknow Regional Depot",
    distanceKm: 28,
    requiredQuantity: "80 - 200 units",
    minQuantity: 40,
    maxQuantity: 200,
    indicativePriceRange: "₹185 – ₹200 / unit",
    initialOfferPrice: 185,
    targetMaxPrice: 198,
    preferredContact: "Agora Real-time Voice Call",
    availabilityStatus: "Available Now (Online)",
    verificationBadge: "Govt Certified Buyer",
    rating: 4.8,
    completedDeals: 98,
    personality: "Supportive women-led cooperative buyer, timely digital payouts.",
    greetingHindi: "Namaste didi! Gramin Vikas Bazaar se Sunita bol rahi hoon. Aapki SHG ki banayi tokriyon ki demand hai.",
    openingVoiceOfferHindi: "Humare cooperative standard ke hisab se ₹185 per basket ka rate ready hai direct bank transfer ke sath.",
    counterResponse1Hindi: "Agar finishing acchi hai toh ₹195 tak adjust kar sakti hoon.",
    dealAcceptedVoiceHindi: "Bahut badhiya didi! ₹200 par hamara agreement done hai.",
  },
  {
    id: "buyer-hastkala-03",
    name: "Vikram Mehta",
    organization: "Hastkala Heritage Exports",
    productCategory: "Handmade Crafts, Honey & Textiles",
    matchedProducts: ["Handmade Basket", "Pure Organic Honey", "Handwoven Cotton Dupatta"],
    location: "Mumbai Port & Export Cluster",
    distanceKm: 120,
    requiredQuantity: "200 - 500 units",
    minQuantity: 100,
    maxQuantity: 1000,
    indicativePriceRange: "₹200 – ₹225 / unit",
    initialOfferPrice: 195,
    targetMaxPrice: 215,
    preferredContact: "Agora Real-time Voice Call",
    availabilityStatus: "Accepting Calls",
    verificationBadge: "Export Verified",
    rating: 4.7,
    completedDeals: 210,
    personality: "High volume export buyer, strict quality check, higher budget.",
    greetingHindi: "Hello! Vikram Mehta here from Hastkala Exports. We need premium handicraft batches for European exhibition dispatch.",
    openingVoiceOfferHindi: "Main seedha ₹195 se start karunga bulk booking ke liye.",
    counterResponse1Hindi: "Quality export grade hai toh ₹210 par final karte hain.",
    dealAcceptedVoiceHindi: "Deal confirmed at ₹210 per piece. We will wire the advance deposit today.",
  },
  {
    id: "buyer-ayur-04",
    name: "Dr. Aniruddh Joshi",
    organization: "Shri Ayur-Veda Naturals",
    productCategory: "Organic Honey & Turmeric",
    matchedProducts: ["Pure Organic Honey", "Organic Turmeric Powder", "shahad", "haldi"],
    location: "Dehradun Herbal Processing Hub",
    distanceKm: 60,
    requiredQuantity: "150 - 500 kg",
    minQuantity: 50,
    maxQuantity: 1000,
    indicativePriceRange: "₹500 – ₹560 / kg",
    initialOfferPrice: 490,
    targetMaxPrice: 540,
    preferredContact: "Agora Real-time Voice Call",
    availabilityStatus: "Available Now (Online)",
    verificationBadge: "Govt Certified Buyer",
    rating: 4.95,
    completedDeals: 315,
    personality: "Ayurvedic pharmacy purchaser looking for pure lab-tested farm harvest.",
    greetingHindi: "Namaste! Hum shuddh jungle shahad aur organic haldi khareedte hain.",
    openingVoiceOfferHindi: "Hum ₹490 per kg par immediate 200 kg utha sakte hain.",
    counterResponse1Hindi: "Agar moisture 18% se kam hai toh ₹530 de denge.",
    dealAcceptedVoiceHindi: "Aapke sample ki quality best hai. ₹540 per kg par deal pakki.",
  }
];

export function findMatchingBuyers(productQuery: string, requestedQuantity?: number): BuyerProfile[] {
  const query = productQuery.toLowerCase();
  
  const matches = SEED_BUYERS.filter(b => {
    return (
      b.matchedProducts.some(p => p.toLowerCase().includes(query) || query.includes(p.toLowerCase())) ||
      b.productCategory.toLowerCase().includes(query)
    );
  });

  if (matches.length > 0) {
    return matches;
  }

  // If general query or basket default
  return SEED_BUYERS.slice(0, 3);
}
