import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { PADDLE_PRICES } from "@/lib/paddle";

const VALID_PLANS = ["4-month", "6-month", "9-month", "12-month"] as const;

type Plan = (typeof VALID_PLANS)[number];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, plan } = body as {
      userId?: string;
      plan?: Plan;
    };

    if (!userId || !plan || !VALID_PLANS.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid user or plan" },
        { status: 400 },
      );
    }

    const priceId = PADDLE_PRICES[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: "Paddle price not configured" },
        { status: 500 },
      );
    }

    // Find the user's existing enterprise account
    let { data: company, error: companyError } = await supabaseAdmin
      .from("enterprise_accounts")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    // Create one if it doesn't exist
    if (!company && !companyError) {
      const { data: newCompany, error: createError } = await supabaseAdmin
        .from("enterprise_accounts")
        .insert({
          name: "My Company",
          owner_id: userId,
          plan: "free",
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Failed to create enterprise account:", createError);

        return NextResponse.json(
          { error: "Failed to create enterprise account" },
          { status: 500 },
        );
      }

      company = newCompany;
    }

    if (!company) {
      console.error("Failed to find enterprise account:", companyError);

      return NextResponse.json(
        { error: "Failed to find enterprise account" },
        { status: 500 },
      );
    }

    // Check whether this company already has a billing record
    const { data: existingBilling, error: existingBillingError } =
      await supabaseAdmin
        .from("billing_accounts")
        .select("id")
        .eq("company_id", company.id)
        .maybeSingle();

    if (existingBillingError) {
      console.error(
        "Failed to check existing billing record:",
        existingBillingError,
      );

      return NextResponse.json(
        { error: "Failed to check billing account" },
        { status: 500 },
      );
    }

    // Update existing billing record or create a new one
    let billing;
    let billingError;

    if (existingBilling) {
      const response = await supabaseAdmin
        .from("billing_accounts")
        .update({
          owner_id: userId,
          plan,
          status: "pending",
          paddle_price_id: priceId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingBilling.id)
        .select("id, company_id, plan, paddle_price_id")
        .single();

      billing = response.data;
      billingError = response.error;
    } else {
      const response = await supabaseAdmin
        .from("billing_accounts")
        .insert({
          company_id: company.id,
          owner_id: userId,
          plan,
          status: "pending",
          paddle_price_id: priceId,
        })
        .select("id, company_id, plan, paddle_price_id")
        .single();

      billing = response.data;
      billingError = response.error;
    }

    if (billingError || !billing) {
      console.error("Failed to create billing record:", billingError);

      return NextResponse.json(
        { error: "Failed to create billing record" },
        { status: 500 },
      );
    }

    if (billingError) {
      console.error("Failed to create billing record:", billingError);

      return NextResponse.json(
        { error: "Failed to create billing record" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      billingId: billing.id,
      companyId: billing.company_id,
      plan: billing.plan,
      priceId: billing.paddle_price_id,
    });
  } catch (error) {
    console.error("Billing create error:", error);

    return NextResponse.json(
      { error: "Failed to prepare billing" },
      { status: 500 },
    );
  }
}
