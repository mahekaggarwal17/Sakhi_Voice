import { NextRequest, NextResponse } from "next/server";
import { executeGetMarketPrice } from "@/lib/agent/tools";
import { SEED_MARKET_DATA } from "@/lib/data/seedMarket";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (query) {
    const result = executeGetMarketPrice(query);
    return NextResponse.json(result);
  }

  return NextResponse.json({ allProducts: SEED_MARKET_DATA });
}
