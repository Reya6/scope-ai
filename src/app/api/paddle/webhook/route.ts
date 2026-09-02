import { NextResponse } from "next/server";
import { Paddle } from "@paddle/paddle-node-sdk";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { getPlanTokenAllocation } from "@/lib/tokens/config";

const paddle = new Paddle(process.env.PADDLE_API_KEY || "");

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("paddle-signature");
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET;

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paddle signature" },
        { status: 400 },
      );
    }

    if (!secretKey) {
      console.error("PADDLE_WEBHOOK_SECRET is missing");

      return NextResponse.json(
        { error: "Webhook configuration missing" },
        { status: 500 },
      );
    }

    // Verify the webhook using the raw request body.
    const event = await paddle.webhooks.unmarshal(
      rawBody,
      secretKey,
      signature,
    );

    const eventId = event.eventId;
    const eventType = event.eventType;

    console.log("Verified Paddle webhook:", eventType, eventId);

    if (!eventId || !eventType) {
      return NextResponse.json(
        { error: "Invalid Paddle event" },
        { status: 400 },
      );
    }

    /*
     * Check whether this exact Paddle event has already been processed.
     *
     * If it exists and processed=true, safely acknowledge the duplicate.
     * If it exists but processed=false, continue processing it because a
     * previous attempt may have failed halfway through.
     */
    const { data: existingEvent, error: lookupError } = await supabaseAdmin
      .from("billing_events")
      .select("id, processed")
      .eq("paddle_event_id", eventId)
      .maybeSingle();

    if (lookupError) {
      console.error("Failed to check billing event:", lookupError);

      return NextResponse.json(
        { error: "Failed to check billing event" },
        { status: 500 },
      );
    }

    if (existingEvent?.processed) {
      return NextResponse.json({
        success: true,
        message: "Event already processed",
      });
    }

    const eventData = event.data as {
      id?: string;
      subscriptionId?: string;
      customerId?: string;
      customData?: {
        billingId?: string;
      } | null;
      billingPeriod?: {
        startsAt?: string;
        endsAt?: string;
      } | null;
    };

    /*
     * Store the verified event.
     *
     * If this is a retry of an existing unprocessed event, the existing
     * billing_events row is reused.
     */
    if (!existingEvent) {
      const { error: eventError } = await supabaseAdmin
        .from("billing_events")
        .insert({
          paddle_event_id: eventId,
          event_type: eventType,
          transaction_id: eventData?.id ?? null,
          subscription_id: eventData?.subscriptionId ?? null,
          payload: event,
          processed: false,
        });

      if (eventError) {
        console.error("Failed to store Paddle event:", eventError);

        return NextResponse.json(
          { error: "Failed to store billing event" },
          { status: 500 },
        );
      }
    }

    /*
     * Provision tokens when Paddle reports transaction.completed.
     */
    if (eventType === "transaction.completed") {
      const billingId = eventData?.customData?.billingId;

      if (!billingId) {
        console.error(
          "transaction.completed received without customData.billingId",
        );

        return NextResponse.json(
          {
            error: "Missing billing ID in Paddle transaction",
          },
          { status: 400 },
        );
      }

      // Find the billing account created before checkout.
      const { data: billing, error: billingLookupError } = await supabaseAdmin
        .from("billing_accounts")
        .select("id, company_id, owner_id, plan, status")
        .eq("id", billingId)
        .maybeSingle();

      if (billingLookupError) {
        console.error(
          "Failed to find billing account:",
          billingLookupError,
        );

        return NextResponse.json(
          { error: "Failed to find billing account" },
          { status: 500 },
        );
      }

      if (!billing) {
        console.error("Billing account not found:", billingId);

        return NextResponse.json(
          { error: "Billing account not found" },
          { status: 404 },
        );
      }

      // Get the token allocation for this subscription plan.
      const tokenAllocation = getPlanTokenAllocation(billing.plan);

      /*
       * Activate the billing account.
       */
      const { error: updateBillingError } = await supabaseAdmin
        .from("billing_accounts")
        .update({
          status: "active",
          paddle_transaction_id: eventData?.id ?? null,
          paddle_subscription_id: eventData?.subscriptionId ?? null,
          paddle_customer_id: eventData?.customerId ?? null,
          started_at:
            eventData?.billingPeriod?.startsAt ?? new Date().toISOString(),
          expires_at: eventData?.billingPeriod?.endsAt ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", billingId);

      if (updateBillingError) {
        console.error(
          "Failed to activate billing account:",
          updateBillingError,
        );

        return NextResponse.json(
          { error: "Failed to activate billing account" },
          { status: 500 },
        );
      }

      /*
       * Keep enterprise_accounts.plan synchronized with the paid plan.
       */
      const { error: companyPlanError } = await supabaseAdmin
        .from("enterprise_accounts")
        .update({
          plan: billing.plan,
        })
        .eq("id", billing.company_id);

      if (companyPlanError) {
        console.error(
          "Failed to update enterprise account plan:",
          companyPlanError,
        );

        return NextResponse.json(
          { error: "Failed to update company plan" },
          { status: 500 },
        );
      }

      /*
       * Grant the company's shared Scope AI token wallet.
       *
       * The company receives:
       * 4-month  -> 40,000
       * 6-month  -> 60,000
       * 9-month  -> 85,500
       * 12-month -> 108,000
       *
       * The database function also records the grant in
       * token_transactions and protects against duplicate grants.
       */
      const { data: tokenResult, error: tokenError } =
        await supabaseAdmin.rpc("grant_scope_tokens", {
          p_company_id: billing.company_id,
          p_tokens: tokenAllocation.totalTokens,
          p_ai_budget_usd:
            (tokenAllocation.priceUsd * tokenAllocation.aiBudgetPercent) /
            100,
          p_expires_at: eventData?.billingPeriod?.endsAt ?? null,
          p_reference_id: eventData?.id ?? eventId,
          p_user_id: billing.owner_id,
          p_meta: {
            billingId: billing.id,
            paddleEventId: eventId,
            paddleTransactionId: eventData?.id ?? null,
            paddleSubscriptionId: eventData?.subscriptionId ?? null,
            plan: billing.plan,
            priceUsd: tokenAllocation.priceUsd,
            aiBudgetPercent: tokenAllocation.aiBudgetPercent,
            totalTokens: tokenAllocation.totalTokens,
          },
        });

      if (tokenError) {
        console.error(
          "Failed to grant Scope AI tokens:",
          tokenError,
        );

        return NextResponse.json(
          { error: "Failed to allocate Scope AI tokens" },
          { status: 500 },
        );
      }

      console.log(
        `Token grant result for company ${billing.company_id}:`,
        tokenResult,
      );

      /*
       * Mark the Paddle event fully processed only after:
       * 1. Billing is active
       * 2. Company plan is updated
       * 3. Tokens are allocated
       * 4. Token grant is recorded by the RPC
       */
      const { error: processedError } = await supabaseAdmin
        .from("billing_events")
        .update({ processed: true })
        .eq("paddle_event_id", eventId);

      if (processedError) {
        console.error(
          "Billing/token grant succeeded, but event could not be marked processed:",
          processedError,
        );

        return NextResponse.json(
          {
            success: true,
            received: eventType,
            warning:
              "Payment and token allocation succeeded, but event status update failed.",
          },
          { status: 200 },
        );
      }

      console.log(
        `Payment completed: ${billing.plan} -> ${tokenAllocation.totalTokens} Scope AI tokens granted to company ${billing.company_id}`,
      );

      return NextResponse.json({
        success: true,
        received: eventType,
        billingId,
        companyId: billing.company_id,
        plan: billing.plan,
        tokensGranted: tokenAllocation.totalTokens,
        aiBudgetUsd:
          (tokenAllocation.priceUsd * tokenAllocation.aiBudgetPercent) / 100,
        tokenResult,
        status: "active",
      });
    }

    /*
     * Other verified Paddle events are accepted for now.
     * Subscription lifecycle handling will be added separately.
     */
    return NextResponse.json({
      success: true,
      received: eventType,
    });
  } catch (error) {
    console.error("Paddle webhook verification/processing error:", error);

    return NextResponse.json(
      { error: "Invalid or failed Paddle webhook" },
      { status: 400 },
    );
  }
}