import { NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";
import supabaseAdmin from "@/lib/supabaseAdmin";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { subject, body, audience, numVariants } = await req.json();

    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication",
        },
        { status: 401 },
      );
    }

    let companyId: string | null = null;

    const { data: enterpriseUser, error: enterpriseUserError } =
      await supabaseAdmin
        .from("enterprise_users")
        .select("company_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (enterpriseUserError) {
      console.error("Failed to find enterprise user:", enterpriseUserError);
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
          "Failed to find enterprise account:",
          enterpriseAccountError,
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
        { status: 403 },
      );
    }

    const prompt = `

You are an expert email marketing simulator that produces realistic, data-driven predictions.

Analyze this campaign for real-world performance potential using proven engagement heuristics.

Campaign:

Subject: ${subject}

Body: ${body}

Audience: ${audience}

Generate believable campaign metrics between 0 and 1.

Return ONLY valid JSON in exactly this format:

{
  "metrics": {
    "open": {
      "value": 0.65,
      "rationale": "..."
    },
    "reply": {
      "value": 0.22,
      "rationale": "..."
    },
    "spam": {
      "value": 0.04,
      "rationale": "..."
    },
    "click": {
      "value": 0.18,
      "rationale": "..."
    },
    "unsubscribe": {
      "value": 0.02,
      "rationale": "..."
    },
    "forward": {
      "value": 0.05,
      "rationale": "..."
    }
  },
  "summary": "A concise summary analyzing the performance and suggestions for improvement.",
  "sampleResponses": [
    "Example realistic user reply 1",
    "Example realistic user reply 2",
    "Example realistic user reply 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const text = response.text ?? "";

    const json = JSON.parse(text);

    const inputTokens = response.usageMetadata?.promptTokenCount ?? 0;

    const outputTokens = response.usageMetadata?.candidatesTokenCount ?? 0;

    const providerCostUsd =
      (inputTokens / 1_000_000) * 0.3 + (outputTokens / 1_000_000) * 2.5;

    const { error: usageError } = await supabaseAdmin.rpc(
      "record_scope_ai_usage",
      {
        p_company_id: companyId,
        p_user_id: user.id,
        p_provider_input_tokens: inputTokens,
        p_provider_output_tokens: outputTokens,
        p_provider_cost_usd: providerCostUsd,
        p_model: "gemini-3.5-flash-lite",
        p_reference_id: crypto.randomUUID(),
        p_meta: {
          numVariants,
        },
      },
    );

    if (usageError) {
      console.error("Failed to record Scope AI usage:", usageError);

      return NextResponse.json(
        {
          success: false,
          error: "Simulation failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      result: json,
    });
  } catch (err) {
    console.error("Simulation error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Simulation failed",
      },
      { status: 500 },
    );
  }
}
