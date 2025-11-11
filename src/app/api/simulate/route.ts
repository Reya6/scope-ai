import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { subject, body, audience, numVariants } = await req.json();

    const prompt = `
You are an expert email marketing simulator that produces realistic, data-driven predictions.

Analyze this campaign for real-world performance potential using proven engagement heuristics.

Campaign:
Subject: ${subject}
Body: ${body}
Audience: ${audience}

Generate believable campaign metrics between 0 and 1.

Output JSON ONLY in this exact format:
{
  "metrics": {
    "open": { "value": 0.65, "rationale": "..." },
    "reply": { "value": 0.22, "rationale": "..." },
    "spam": { "value": 0.04, "rationale": "..." },
    "click": { "value": 0.18, "rationale": "..." },
    "unsubscribe": { "value": 0.02, "rationale": "..." },
    "forward": { "value": 0.05, "rationale": "..." }
  },
  "summary": "A concise summary analyzing the performance and suggestions for improvement.",
  "sampleResponses": [
    "Example realistic user reply 1",
    "Example realistic user reply 2",
    "Example realistic user reply 3"
  ]
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const json = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      result: json,
    });
  } catch (err) {
    console.error("Simulation error:", err);
    return NextResponse.json(
      { success: false, error: "Simulation failed" },
      { status: 500 }
    );
  }
}
