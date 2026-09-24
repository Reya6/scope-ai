"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f8ece4] px-6">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
        <h1 className="text-3xl font-extrabold mb-4 text-black">
          Payment Successful
        </h1>

        <p className="text-gray-700 font-mono mb-6">
          Thank you for your payment. Your enterprise account is being
          activated.
        </p>

        <p className="text-sm text-gray-500 font-mono">
          Redirecting you to your dashboard...
        </p>
      </div>
    </section>
  );
}
