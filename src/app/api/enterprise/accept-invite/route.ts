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
      .select("id, email, company_id, role, expires_at")
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inviteError) {
      console.error("Invite lookup error:", inviteError);

      return NextResponse.json(
        { success: false, error: "Unable to find your invitation." },
        { status: 500 }
      );
    }

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "No enterprise invitation found for this email." },
        { status: 404 }
      );
    }

    if (
      invite.expires_at &&
      new Date(invite.expires_at).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { success: false, error: "This enterprise invitation has expired." },
        { status: 410 }
      );
    }

    if (!invite.company_id) {
      return NextResponse.json(
        { success: false, error: "This invitation is missing a company." },
        { status: 400 }
      );
    }

    const { data: existingMembership, error: membershipLookupError } =
      await supabaseAdmin
        .from("enterprise_users")
        .select("id, company_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipLookupError) {
      console.error(
        "Existing membership lookup error:",
        membershipLookupError
      );

      return NextResponse.json(
        { success: false, error: "Unable to check your enterprise membership." },
        { status: 500 }
      );
    }

    if (existingMembership) {
      if (existingMembership.company_id === invite.company_id) {
        return NextResponse.json({
          success: true,
          message: "You are already a member of this enterprise account.",
          companyId: invite.company_id,
          role: existingMembership.role,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: "This account is already linked to another enterprise account.",
        },
        { status: 409 }
      );
    }

    const { data: membership, error: membershipError } =
      await supabaseAdmin
        .from("enterprise_users")
        .insert({
          user_id: user.id,
          company_id: invite.company_id,
          role: invite.role || "member",
        })
        .select("id, user_id, company_id, role")
        .single();

    if (membershipError || !membership) {
      console.error("Enterprise membership creation error:", membershipError);

      return NextResponse.json(
        { success: false, error: "Failed to join the enterprise account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You have joined the enterprise account successfully.",
      companyId: membership.company_id,
      role: membership.role,
    });
  } catch (error: any) {
    console.error("Accept enterprise invite error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
