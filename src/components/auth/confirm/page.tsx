"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState("Verifying your email...");
  const router = useRouter();

  useEffect(() => {
    const confirmEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get("token_hash");
      const type = params.get("type");

      if (!token_hash || !type) {
        setStatus("Invalid or missing verification link.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        type: type as "email" | "signup" | "invite" | "recovery",
        token_hash,
      });

      if (error) {
        setStatus("❌ Verification failed or link expired.");
      } else {
        setStatus("✅ Email confirmed successfully! Redirecting...");
        setTimeout(() => router.push("/"), 2500);
      }
    };

    confirmEmail();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full bg-white/5 border border-[#E26D5A] rounded-2xl p-8 text-center shadow-xl">
        <h1 className="text-3xl font-extrabold mb-4 text-white">
          Email Confirmation
        </h1>
        <p className="text-lg text-gray-300">{status}</p>
      </div>
    </div>
  );
}
