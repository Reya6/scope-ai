"use client";

import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { PADDLE_PRICES } from "@/lib/paddle";

export default function Payment12Month() {
  const [paddle, setPaddle] = useState<Paddle | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!token) {
      setError("Paddle configuration is missing.");
      return;
    }

    initializePaddle({
      environment: "sandbox",
      token,
    })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      })
      .catch((err) => {
        console.error("Paddle initialization error:", err);
        setError("Unable to initialize payment. Please try again.");
      });
  }, []);

  const handlePayment = () => {
    if (!paddle) {
      setError("Payment system is still loading. Please try again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      paddle.Checkout.open({
        items: [
          {
            priceId: PADDLE_PRICES["12-month"],
            quantity: 1,
          },
        ],
      });
    } catch (err) {
      console.error("Paddle checkout error:", err);
      setError("Unable to open payment checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f8ece4] px-6">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
        <h1 className="text-3xl font-extrabold mb-4 h-montserrat text-black">
          12-Month Enterprise Plan
        </h1>

        <p className="text-gray-700 font-mono mb-6">
          Enjoy full access to all features for 12 months.
        </p>

        {error && (
          <p className="text-red-600 font-bold mb-4 text-sm">{error}</p>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !paddle}
          className="w-full bg-black text-white font-extrabold py-3 rounded-[3px] hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Opening Checkout..." : "Proceed to Payment"}
        </button>
      </div>
    </section>
  );
}
