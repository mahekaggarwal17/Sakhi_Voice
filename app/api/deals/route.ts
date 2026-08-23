import { NextRequest, NextResponse } from "next/server";
import { executeCreateDeal, RECORDED_DEALS } from "@/lib/agent/tools";

export async function GET() {
  return NextResponse.json({ deals: RECORDED_DEALS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerId, product, quantity, agreedPrice, confirmedByUser } = body;

    const result = executeCreateDeal(buyerId, product, quantity, agreedPrice, confirmedByUser);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
