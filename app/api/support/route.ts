import { NextRequest, NextResponse } from "next/server";
import { executeFindSupportOptions, executeCreateSupportCase, RECORDED_CASES } from "@/lib/agent/tools";
import { INITIAL_BUSINESS_MEMORY } from "@/lib/agent/conversationState";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const need = searchParams.get("need") || "financial assistance";

  const result = executeFindSupportOptions(need);
  return NextResponse.json({ ...result, cases: RECORDED_CASES });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memory, requestedAmount, purpose } = body;

    const result = executeCreateSupportCase(
      memory || INITIAL_BUSINESS_MEMORY,
      requestedAmount || "₹50,000",
      purpose || "Production Capacity Expansion & Raw Materials"
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
