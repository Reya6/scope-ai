"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState("Verifying your invitation...");
  const router = useRouter();

  useEffect(() => {
    const confirmInvite = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const tokenHash = params.get("token_hash");
        const type = params.get("type");

        if (!tokenHash || !type) {
          setStatus("Invalid or missing verification link.");
          return;
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: type as "email" | "signup" | "invite" | "recovery",
          token_hash: tokenHash,
        });

        if (verifyError) {
          setStatus("❌ Verification failed or the invitation has expired.");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setStatus(
            "Email verified, but your session could not be created. Please log in and try again."
          );
          return;
        }

        const response = await fetch("/api/enterprise/accept-invite", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setStatus(
            `❌ ${data.error ?? "Unable to join the enterprise account."}`
          );
          return;
        }

        setStatus("✅ Invitation accepted! Redirecting to your dashboard...");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Invite confirmation error:", error);
        setStatus("❌ Something went wrong while accepting the invitation.");
      }
    };

    confirmInvite();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full bg-white/5 border border-[#E26D5A] rounded-2xl p-8 text-center shadow-xl">
        <h1 className="text-3xl font-extrabold mb-4 text-white">
          Enterprise Invitation
        </h1>

        <p className="text-lg text-gray-300">{status}</p>
      </div>
    </div>
  );
}
