"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Payment4Month() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f8ece4] px-6">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
        <h1 className="text-3xl font-extrabold mb-4 h-montserrat text-black">
          4-Month Enterprise Plan
        </h1>
        <p className="text-gray-700 font-mono mb-6">
          Access everything for 4 months.
        </p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-black text-white font-extrabold py-3 rounded-[3px] hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </section>
  );
}
