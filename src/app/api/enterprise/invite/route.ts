import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication." },
        { status: 401 },
      );
    }

    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("enterprise_users")
      .select("company_id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      console.error("Enterprise membership lookup error:", membershipError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify your enterprise account.",
        },
        { status: 500 },
      );
    }

    if (!membership) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not a member of an enterprise account.",
        },
        { status: 403 },
      );
    }

    if (membership.role !== "owner") {
      return NextResponse.json(
        {
          success: false,
          error: "Only the company owner can invite team members.",
        },
        { status: 403 },
      );
    }

    const companyId = membership.company_id;

    const body = await req.json();
    const email = body?.email?.trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email." },
        { status: 400 },
      );
    }

    const { data: company, error: companyError } = await supabaseAdmin
      .from("enterprise_accounts")
      .select("id, owner_id, plan")
      .eq("id", companyId)
      .maybeSingle();

    if (companyError) {
      console.error("Company lookup error:", companyError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify company.",
        },
        { status: 500 },
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: "Enterprise account not found.",
        },
        { status: 404 },
      );
    }

    if (company.owner_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not the owner of this enterprise account.",
        },
        { status: 403 },
      );
    }

    const token = randomUUID();

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("enterprise_invites")
      .insert([
        {
          email,
          company_id: companyId,
          role: "member",
          token,
        },
      ])
      .select()
      .single();

    if (inviteError || !invite) {
      console.error("Enterprise invite database error:", inviteError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create enterprise invitation.",
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${new URL(req.url).origin}/auth/confirm`,
      },
    );

    if (error) {
      console.error("Supabase invite error:", error);

      await supabaseAdmin
        .from("enterprise_invites")
        .delete()
        .eq("id", invite.id);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invite sent successfully to ${email}`,
      invite: data,
      enterpriseInvite: {
        id: invite.id,
        email: invite.email,
        companyId: invite.company_id,
        role: invite.role,
        expiresAt: invite.expires_at,
      },
    });
  } catch (err: any) {
    console.error("Error sending enterprise invite:", err);

    return NextResponse.json(
      {
        success: false,
        error: String(err?.message ?? err),
      },
      { status: 500 },
    );
  }
}
