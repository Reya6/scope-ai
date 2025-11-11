import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

/**
 * POST /api/enterprise/invite
 * Body: { email: string }
 *
 * Sends a real Supabase invite email.
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email" },
        { status: 400 }
      );
    }

    // Send Supabase-managed invite
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email
    );

    if (error) {
      console.error("Invite error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invite sent successfully to ${email}`,
      invite: data,
    });
  } catch (err: any) {
    console.error("Error sending invite:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
