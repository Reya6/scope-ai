import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error("❌ Missing Supabase environment variables");
      return NextResponse.json(
        { success: false, error: "Missing Supabase env vars" },
        { status: 500 }
      );
    }

    console.log("✅ Env vars loaded successfully");

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("enterprise_accounts")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase query failed:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Supabase connected successfully");

    return NextResponse.json({
      success: true,
      message: "✅ Supabase Admin client connected successfully!",
      sampleData: data,
    });
  } catch (err) {
    console.error("❌ Test route error:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
