import { NextResponse } from "next/server";
import { Paddle } from "@paddle/paddle-node-sdk";

import supabaseAdmin from "@/lib/supabaseAdmin";

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

    // Verify the Paddle webhook.
    const event = await paddle.webhooks.unmarshal(
      rawBody,
      secretKey,
      signature,
    );

    console.log("Verified Paddle webhook:", event.eventType);

    const eventId = event.eventId;
    const eventType = event.eventType;

    if (!eventId || !eventType) {
      return NextResponse.json(
        { error: "Invalid Paddle event" },
        { status: 400 },
      );
    }

    // Prevent duplicate processing.
    const { data: existingEvent, error: lookupError } = await supabaseAdmin
      .from("billing_events")
      .select("id")
      .eq("paddle_event_id", eventId)
      .maybeSingle();

    if (lookupError) {
      console.error("Failed to check billing event:", lookupError);

      return NextResponse.json(
        { error: "Failed to check billing event" },
        { status: 500 },
      );
    }

    if (existingEvent) {
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

    // Store the verified Paddle event first.
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

    // Only activate the account after a completed transaction.
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

      const { data: billing, error: billingLookupError } = await supabaseAdmin
        .from("billing_accounts")
        .select("id, company_id, plan, status")
        .eq("id", billingId)
        .maybeSingle();

      if (billingLookupError) {
        console.error("Failed to find billing account:", billingLookupError);

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

      // Activate the billing account.
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

      console.log(
        `Billing account ${billingId} activated successfully for ${billing.plan}`,
      );

      // Mark the event as processed.
      const { error: processedError } = await supabaseAdmin
        .from("billing_events")
        .update({ processed: true })
        .eq("paddle_event_id", eventId);

      if (processedError) {
        console.error(
          "Billing activated, but failed to mark event processed:",
          processedError,
        );

        return NextResponse.json(
          {
            success: true,
            received: eventType,
            warning: "Billing activated but event was not marked processed",
          },
          { status: 200 },
        );
      }

      return NextResponse.json({
        success: true,
        received: eventType,
        billingId,
        status: "active",
      });
    }

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
