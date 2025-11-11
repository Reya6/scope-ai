// src/lib/tokenTracking.ts
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function logUsage({
  organizationId,
  userId,
  tokensUsed,
  model,
}: {
  organizationId: string;
  userId?: string;
  tokensUsed: number;
  model: string;
}) {
  try {
    // 1️⃣ Log usage details
    const { error: logError } = await supabaseAdmin.from("usage_logs").insert([
      {
        organization_id: organizationId,
        user_id: userId || null,
        tokens_used: tokensUsed,
        model,
      },
    ]);

    if (logError) throw logError;

    // 2️⃣ Deduct tokens from token_balances
    const { data: balanceData, error: fetchError } = await supabaseAdmin
      .from("token_balances")
      .select("used_tokens, total_tokens")
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) throw fetchError;

    const updatedUsed = (balanceData?.used_tokens || 0) + tokensUsed;

    const { error: updateError } = await supabaseAdmin
      .from("token_balances")
      .update({
        used_tokens: updatedUsed,
        last_updated: new Date().toISOString(),
      })
      .eq("organization_id", organizationId);

    if (updateError) throw updateError;

    // Optional: detect if they are over quota
    const remaining = (balanceData?.total_tokens || 0) - updatedUsed;
    if (remaining < 0) {
      console.warn(
        `⚠️ Organization ${organizationId} exceeded their token limit`
      );
    }

    return { success: true, remaining };
  } catch (err) {
    console.error("❌ Token tracking error:", err);
    return { success: false, error: String(err) };
  }
}
