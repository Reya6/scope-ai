import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { subject, body, persona, variantCount = 3 } = await req.json();

    const prompt = `
You are an expert direct-response email copywriter who creates A/B test variants that genuinely improve conversion potential.

Generate ${variantCount} unique, high-performing variants of this campaign.

Subject: ${subject}

Body:
${body}

Persona:
${persona}

Return ONLY valid JSON in exactly this format:

{
  "variants": [
    {
      "name": "Variant A",
      "subject": "Improved subject line here",
      "body": "Improved email body here"
    },
    {
      "name": "Variant B",
      "subject": "Another high-performing subject line",
      "body": "Different but related email body"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text ?? "";

    const json = JSON.parse(text);

    return NextResponse.json({
      success: true,
      result: json,
    });
  } catch (err) {
    console.error("Variant generation error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Variant generation failed",
      },
      { status: 500 },
    );
  }
}
