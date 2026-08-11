import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import supabaseAdmin from "@/lib/supabaseAdmin";

/**
 * POST /api/enterprise/invite
 *
 * Body:
 * {
 *   email: string;
 *   companyId?: string;
 *   invitedBy?: string;
 * }
 *
 * Sends a real Supabase invite email and stores the
 * pending enterprise invitation in enterprise_invites.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body?.email?.trim();
    const companyId = body?.companyId?.trim() || null;
    const invitedBy = body?.invitedBy?.trim() || null;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email" },
        { status: 400 },
      );
    }

    /*
     * Find the company.
     *
     * Priority:
     * 1. Use companyId supplied by the client.
     * 2. Otherwise find the company owned by invitedBy.
     */
    let resolvedCompanyId = companyId;

    if (resolvedCompanyId) {
      const { data: company, error: companyError } = await supabaseAdmin
        .from("enterprise_accounts")
        .select("id")
        .eq("id", resolvedCompanyId)
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
            error: "Company not found.",
          },
          { status: 404 },
        );
      }
    }

    if (!resolvedCompanyId && invitedBy) {
      const { data: company, error: companyError } = await supabaseAdmin
        .from("enterprise_accounts")
        .select("id")
        .eq("owner_id", invitedBy)
        .limit(1)
        .maybeSingle();

      if (companyError) {
        console.error("Owner company lookup error:", companyError);

        return NextResponse.json(
          {
            success: false,
            error: "Unable to find your enterprise account.",
          },
          { status: 500 },
        );
      }

      if (company) {
        resolvedCompanyId = company.id;
      }
    }

    /*
     * We need a company before creating an enterprise invitation.
     */
    if (!resolvedCompanyId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No company could be determined. Please make sure your enterprise account exists.",
        },
        { status: 400 },
      );
    }

    /*
     * Generate a unique token for the pending enterprise invite.
     */
    const token = randomUUID();

    /*
     * Store the pending invitation.
     */
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("enterprise_invites")
      .insert([
        {
          email,
          company_id: resolvedCompanyId,
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

    /*
     * Send the real Supabase-managed invitation email.
     *
     * This preserves the behavior from your original file.
     */
    const { data, error } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) {
      console.error("Invite error:", error);

      /*
       * If the actual Supabase invitation failed,
       * remove the pending database invitation so we
       * don't leave an unusable invite behind.
       */
      await supabaseAdmin
        .from("enterprise_invites")
        .delete()
        .eq("id", invite.id);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    /*
     * Everything succeeded.
     */
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
    console.error("Error sending invite:", err);

    return NextResponse.json(
      {
        success: false,
        error: String(err?.message ?? err),
      },
      { status: 500 },
    );
  }
}
