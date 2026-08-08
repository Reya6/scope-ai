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

  const testEmail = "6reya66@gmil.com";

  try {
    const response = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        email_confirm: false,
      }),
    });

    const text = await response.text();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      response: text,
      keyPrefix: key.substring(0, 11),
      urlHost: new URL(url).host,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
