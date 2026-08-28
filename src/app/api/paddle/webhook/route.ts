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

    // Verify the webhook and parse the event.
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

    // Store the verified Paddle event.
    const eventData = event.data as {
      id?: string;
      subscriptionId?: string;
    };

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
