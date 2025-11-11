"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/workstation");
    };
    checkSession();
  }, [router]);

  // ✅ Handle Email Signup (with confirmation + duplicate redirect)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!agreePrivacy) {
      setMessage("❗ Please agree to the Privacy Policy before signing up.");
      return;
    }

    if (!email || !password) {
      setMessage("❗ Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      setLoading(false);

      if (error) {
        // 🚫 If the user already exists
        if (error.message.includes("User already registered")) {
          setMessage(
            "⚠️ This email is already registered. Redirecting to login..."
          );
          setTimeout(() => router.push("/workstation2"), 2000);
        } else {
          setMessage(`⚠️ ${error.message}`);
        }
        return;
      }

      // ✅ Success — show confirmation message
      setMessage(
        "✅ Check your email for a confirmation link to activate your account."
      );
    } catch (err: any) {
      setMessage("⚠️ Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Handle Google signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    const redirectTo = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setMessage(`⚠️ ${error.message}`);
    } else {
      router.push("/workstation");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-white/5 border border-[#E26D5A] rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-white">
          Create an Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full p-3 rounded-md bg-black border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E26D5A]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-md bg-black border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E26D5A]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters recommended
            </p>
          </div>

          {/* Privacy Policy checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="w-4 h-4 accent-[#E26D5A]"
            />
            <span>
              I agree to the{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="text-[#E26D5A] underline"
              >
                terms of service
              </a>
              .
            </span>
          </label>

          {/* Message output */}
          {message && (
            <div className="text-center text-sm text-amber-400">{message}</div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E26D5A] text-white py-3 rounded-md font-semibold hover:bg-[#c85849] transition-all"
          >
            {loading ? "Creating account..." : "Sign Up with Email"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.42 1.22 8.59 3.6l6.39-6.39C35.54 3.24 30.24 1 24 1 14.92 1 7.07 6.48 3.66 14.02l7.44 5.79C12.39 13.39 17.73 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24c0-1.56-.14-3.06-.39-4.5H24v9h12.7c-.55 2.89-2.2 5.33-4.7 6.98l7.27 5.66C43.98 37.31 46.5 31.12 46.5 24z"
            />
            <path
              fill="#4A90E2"
              d="M10.64 28.79A14.43 14.43 0 0 1 9.5 24c0-1.67.3-3.28.84-4.79l-7.44-5.79C1.7 16.98 1 20.41 1 24s.7 7.02 1.9 10.58l7.74-5.79z"
            />
            <path
              fill="#FBBC05"
              d="M24 47c6.48 0 11.93-2.13 15.91-5.83l-7.27-5.66c-2.01 1.35-4.59 2.14-8.64 2.14-6.27 0-11.61-3.89-13.9-9.27l-7.74 5.79C7.07 41.52 14.92 47 24 47z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/workstation2" className="text-[#E26D5A] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
