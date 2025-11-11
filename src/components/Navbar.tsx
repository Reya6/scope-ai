"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Load and listen for session changes
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setUser(null);
      router.push("/"); // redirect to landing page
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#f8ece4] shadow-md z-[1000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="bg-[#fef6f2] p-3">
            <span className="text-black font-bold text-sm tracking-tight">
              ☐SCOPE
            </span>
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex space-x-8 text-black font-mono text-lg">
          <a href="/#hero" className="relative group">
            Home
            <span className="absolute left-0 bottom-[-4px] w-0 h-[3px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="/#pricing" className="relative group">
            Pricing
            <span className="absolute left-0 bottom-[-4px] w-0 h-[3px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="/#capabilities" className="relative group">
            Features
            <span className="absolute left-0 bottom-[-4px] w-0 h-[3px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="/#faq" className="relative group">
            FAQ
            <span className="absolute left-0 bottom-[-4px] w-0 h-[3px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex space-x-3 items-center">
          {user ? (
            <>
              <span className="font-mono text-base text-black hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-sm font-mono text-lg hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/workstation2")}
                className="bg-black text-white px-4 py-2 rounded-sm font-mono text-lg hover:opacity-90 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/workstation")}
                className="bg-[#E26D5A] text-white px-4 py-2 rounded-sm font-mono text-lg hover:opacity-90 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
