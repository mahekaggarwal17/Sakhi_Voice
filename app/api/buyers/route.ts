import { NextRequest, NextResponse } from "next/server";
import { executeFindBuyers } from "@/lib/agent/tools";
import { SEED_BUYERS } from "@/lib/data/seedBuyers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "Handmade Basket";
  const qty = Number(searchParams.get("quantity")) || 100;

  const result = executeFindBuyers(query, qty);
  return NextResponse.json(result);
}
