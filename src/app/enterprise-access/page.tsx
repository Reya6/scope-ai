"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnterpriseAccess() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Updated flat routes (no /payment folder)
  const validCodes: Record<string, string> = {
    "12MONTH": "/12-month",
    "9MONTH": "/9-month",
    "6MONTH": "/6-month",
    "4MONTH": "/4-month",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const codeUpper = code.trim().toUpperCase();

    if (!validCodes[codeUpper]) {
      setError("Invalid code. Please check and try again.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      router.push(validCodes[codeUpper]);
    }, 800);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f8ece4] px-6">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
        <h1 className="text-3xl font-extrabold mb-6 h-montserrat text-black">
          Enter Enterprise Access Code
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border-2 border-black px-4 py-3 mb-4 rounded-md font-bold text-black text-center font-mono focus:outline-none focus:ring-2 focus:ring-black"
          />
          {error && (
            <p className="text-red-600 text-sm mb-3 font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-extrabold py-3 rounded-[3px] hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </section>
  ); 
}
