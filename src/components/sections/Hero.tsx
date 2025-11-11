"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Hero() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Ensure client-side rendering only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Check session on mount + listen for auth changes
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsLoggedIn(!!session)
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [isClient]);

  // ✅ Button handler
  const handleGetStarted = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.push("/dashboard"); // 🟢 main workstation/dashboard
    } else {
      router.push("/workstation2"); // 🔴 login page
    }
  };

  if (!isClient) return null;

  return (
    <section
      id="hero"
      className="py-30 flex items-center bg-[#F8ECE4] px-6 md:px-12"
    >
      <div className="max-w-5xl mx-auto text-center md:text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-black leading-tight h-montserrat tracking-[-0.035em] mt-4">
          Scope AI - Campaign Simulator Predict <br />
          your Success in Seconds
        </h1>

        <p className="mt-6 text-lg md:text-xl text-black leading-relaxed">
          Elevate your outreach: Simulate, optimize, and perfect campaigns
          before they go live.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <a
            href="#simulator"
            className="px-6 py-3 bg-black text-white rounded-[2px] font-medium hover:opacity-90 transition"
          >
            Learn More
          </a>

          <a
            href="#footer"
            className="px-6 py-3 bg-[#F8ECE4] text-black border border-black rounded-[2px] font-medium hover:bg-gray-100 transition"
          >
            Contact Sales
          </a>

          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-[#E26D5A] text-white rounded-[2px] font-medium hover:opacity-90 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
