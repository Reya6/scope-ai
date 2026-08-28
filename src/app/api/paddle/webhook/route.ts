import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    // Get the raw request body
    const rawBody = await request.text();

    // Paddle signature header
    const signature = request.headers.get("paddle-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paddle signature" },
        { status: 400 },
      );
    }

    // Temporary: parse event
    // Signature verification will be added next
    const event = JSON.parse(rawBody);

    console.log("Paddle webhook received:", event.event_type);

    // Basic event information
    const eventId = event.event_id;
    const eventType = event.event_type;

    if (!eventId || !eventType) {
      return NextResponse.json(
        { error: "Invalid Paddle event" },
        { status: 400 },
      );
    }

    // Check if this event was already processed
    const { data: existingEvent } = await supabaseAdmin
      .from("billing_events")
      .select("id")
      .eq("paddle_event_id", eventId)
      .maybeSingle();

    // Prevent duplicate webhook processing
    if (existingEvent) {
      return NextResponse.json({
        success: true,
        message: "Event already processed",
      });
    }

    // Store the webhook event
    const { error: eventError } = await supabaseAdmin
      .from("billing_events")
      .insert({
        paddle_event_id: eventId,
        event_type: eventType,
        transaction_id: event.data?.id ?? null,
        subscription_id: event.data?.subscription_id ?? null,
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
    console.error("Paddle webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
