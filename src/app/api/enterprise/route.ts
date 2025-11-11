import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

/**
 * POST /api/enterprise
 * Body: { userId: string, companyName?: string }
 *
 * Behavior:
 * - If a company already exists with owner_id = userId -> return it
 * - Otherwise create enterprise_accounts row, and enterprise_users link (role = 'owner')
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;
    let companyName = body?.companyName ?? null;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    // 1) check existing company for this owner
    const { data: existing, error: selErr } = await supabaseAdmin
      .from("enterprise_accounts")
      .select("*")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();

    if (selErr) {
      console.error("Error checking existing company:", selErr);
      // continue, attempt to create anyway
    }

    if (existing) {
      return NextResponse.json({ success: true, company: existing });
    }

    // 2) fallback companyName if not provided
    if (!companyName) companyName = `Company of ${userId.slice(0, 8)}`;

    // 3) create company
    const { data: company, error: createErr } = await supabaseAdmin
      .from("enterprise_accounts")
      .insert([{ name: companyName, owner_id: userId }])
      .select()
      .single();

    if (createErr || !company) {
      console.error("Error creating company:", createErr);
      return NextResponse.json(
        { success: false, error: "Failed to create company" },
        { status: 500 }
      );
    }

    // 4) link user as owner in enterprise_users
    const { error: linkErr } = await supabaseAdmin
      .from("enterprise_users")
      .insert([{ user_id: userId, company_id: company.id, role: "owner" }]);

    if (linkErr) {
      console.warn("Warning: failed to insert enterprise_users link:", linkErr);
      // not fatal — company exists, return company info
    }

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    console.error("API /api/enterprise error:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
