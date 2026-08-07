import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing SUPABASE_URL or SUPABASE_SECRET_KEY",
      },
      { status: 500 },
    );
  }

  const response = await fetch(`${url}/auth/v1/settings`, {
    method: "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  const text = await response.text();

  return NextResponse.json({
    success: response.ok,
    status: response.status,
    response: text,
    keyPrefix: key.substring(0, 11),
    urlHost: new URL(url).host,
  });
}
