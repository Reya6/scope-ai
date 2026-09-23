import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    // 1. Require the user's Supabase access token
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    // 2. Verify the token server-side
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication" },
        { status: 401 }
      );
    }

    // 3. Resolve the user's company server-side
    let companyId: string | null = null;

    const { data: enterpriseUser, error: enterpriseUserError } =
      await supabaseAdmin
        .from("enterprise_users")
        .select("company_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (enterpriseUserError) {
      console.error(
        "Error finding enterprise user:",
        enterpriseUserError
      );
    }

    if (enterpriseUser?.company_id) {
      companyId = enterpriseUser.company_id;
    } else {
      const { data: enterpriseAccount, error: enterpriseAccountError } =
        await supabaseAdmin
          .from("enterprise_accounts")
          .select("id")
          .eq("owner_id", user.id)
          .maybeSingle();

      if (enterpriseAccountError) {
        console.error(
          "Error finding enterprise account:",
          enterpriseAccountError
        );
      }

      if (enterpriseAccount?.id) {
        companyId = enterpriseAccount.id;
      }
    }

    if (!companyId) {
      return NextResponse.json(
        {
          success: false,
          error: "No enterprise account found for this user",
        },
        { status: 403 }
      );
    }

    // 4. Read the company's token wallet
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from("enterprise_tokens")
      .select(
        "total_tokens, used_tokens, expires_at, ai_budget_usd, ai_spent_usd"
      )
      .eq("company_id", companyId)
      .maybeSingle();

    if (walletError) {
      console.error("Error reading token wallet:", walletError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to load token information",
        },
        { status: 500 }
      );
    }

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          error: "No token wallet found for this company",
        },
        { status: 404 }
      );
    }

    // 5. Calculate values server-side
    const totalTokens = Number(wallet.total_tokens ?? 0);
    const usedTokens = Number(wallet.used_tokens ?? 0);
    const remainingTokens = Math.max(totalTokens - usedTokens, 0);

    const aiBudgetUsd = Number(wallet.ai_budget_usd ?? 0);
    const aiSpentUsd = Number(wallet.ai_spent_usd ?? 0);
    const remainingAiBudgetUsd = Math.max(aiBudgetUsd - aiSpentUsd, 0);

    return NextResponse.json({
      success: true,
      tokens: {
        total: totalTokens,
        used: usedTokens,
        remaining: remainingTokens,
      },
      aiBudget: {
        totalUsd: aiBudgetUsd,
        spentUsd: aiSpentUsd,
        remainingUsd: remainingAiBudgetUsd,
      },
      expiresAt: wallet.expires_at,
    });
  } catch (err) {
    console.error("API /api/tokens error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load token information",
      },
      { status: 500 }
    );
  }
}
