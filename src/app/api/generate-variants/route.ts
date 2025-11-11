import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { subject, body, persona, variantCount = 3 } = await req.json();

    const prompt = `
You are an expert direct-response email copywriter who creates A/B test variants that genuinely improve conversion potential.

Generate ${variantCount} unique, high-performing variants of this campaign:

Subject: ${subject}
Body: ${body}
Persona: ${persona}

Return ONLY pure JSON in this exact format:
{
  "variants": [
    { "name": "Variant A", "subject": "Improved subject line here", "body": "Improved email body here" },
    { "name": "Variant B", "subject": "Another high-performing subject line", "body": "Different but related email body" }
  ]
}
`;

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
    console.error("Variant generation error:", err);
    return NextResponse.json(
      { success: false, error: "Variant generation failed" },
      { status: 500 }
    );
  }
}
