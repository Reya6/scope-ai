import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user || !user.email) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication." },
        { status: 401 }
      );
    }

    const email = user.email.trim().toLowerCase();

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("enterprise_invites")
      .select("id, email, company_id, role, expires_at, accepted_at")
      .ilike("email", email)
      .is("accepted_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inviteError) {
      return NextResponse.json(
        { success: false, error: "Unable to find your invitation." },
        { status: 500 }
      );
    }

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "No active invitation was found for this email." },
        { status: 404 }
      );
    }

    if (
      invite.expires_at &&
      new Date(invite.expires_at).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { success: false, error: "This invitation has expired." },
        { status: 410 }
      );
    }

    if (!invite.company_id) {
      return NextResponse.json(
        { success: false, error: "This invitation is missing a company." },
        { status: 400 }
      );
    }

    const { data: existingMembership, error: membershipCheckError } =
      await supabaseAdmin
        .from("enterprise_users")
        .select("id, company_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipCheckError) {
      return NextResponse.json(
        { success: false, error: "Unable to verify your company membership." },
        { status: 500 }
      );
    }

    if (existingMembership) {
      if (existingMembership.company_id === invite.company_id) {
        return NextResponse.json({
          success: true,
          message: "You are already a member of this enterprise account.",
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: "Your account is already connected to another enterprise account.",
        },
        { status: 409 }
      );
    }

    const { error: membershipError } = await supabaseAdmin
      .from("enterprise_users")
      .insert({
        user_id: user.id,
        company_id: invite.company_id,
        role: invite.role || "member",
      });

    if (membershipError) {
      return NextResponse.json(
        { success: false, error: "Unable to add you to the enterprise account." },
        { status: 500 }
      );
    }

    const { error: acceptError } = await supabaseAdmin
      .from("enterprise_invites")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invite.id)
      .is("accepted_at", null);

    if (acceptError) {
      return NextResponse.json(
        {
          success: false,
          error: "Membership was created, but the invitation could not be finalized.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation accepted successfully.",
      companyId: invite.company_id,
      role: invite.role || "member",
    });
  } catch (error) {
    console.error("Accept invite error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
