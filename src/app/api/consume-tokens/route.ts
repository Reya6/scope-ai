import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

// POST /api/consume-tokens
// Body: { company_id: string, amount: number }
export async function POST(req: Request) {
  try {
    const { company_id, amount } = await req.json();

    if (!company_id || !amount)
      return NextResponse.json(
        { error: "Missing company_id or amount" },
        { status: 400 }
      );

    const { data, error } = await supabaseAdmin.rpc("consume_tokens", {
      company_id_input: company_id,
      tokens_input: amount,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      remaining_tokens: data,
    });
  } catch (err: any) {
    console.error("consume-tokens error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
