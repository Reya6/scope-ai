"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPanel() {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUserSession(data?.session ?? null);
    });

    // Handle auth state change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUserSession(session);

        if (event === "SIGNED_IN" && session) {
          try {
            // ✅ Notify backend about new/returning enterprise user
            await fetch("/api/enterprise", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: session.user.id }), // 🔥 FIXED LINE
            });
          } catch (err) {
            console.error("Enterprise API call failed:", err);
          }

          router.push("/dashboard");
        } else if (event === "SIGNED_OUT") {
          router.push("/workstation2");
        }
      }
    );

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      setLoading(false);
      if (error) throw error;
      router.push("/workstation2");
    } catch (err) {
      console.error("Sign out error:", err);
      setLoading(false);
    }
  };

  if (!userSession) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl border border-white/20 text-white">
        <p className="mb-3 text-base">You are not signed in.</p>
        <a
          href="/workstation2"
          className="px-4 py-2 bg-[#E26D5A] hover:bg-[#ff7b68] rounded-lg text-white font-semibold"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl border border-white/20 text-white">
      <h2 className="text-lg font-bold mb-1">Welcome 👋</h2>
      <p className="mb-4 text-sm text-gray-200">{userSession.user?.email}</p>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold"
      >
        {loading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
