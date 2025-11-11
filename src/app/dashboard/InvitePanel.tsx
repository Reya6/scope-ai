"use client";

import { useState } from "react";

export default function InvitePanel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendInvite = async () => {
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/enterprise/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: "test-company-123", // we'll replace this dynamically later
          invited_by: "user-001", // same here — use current user's ID
          email,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Invite sent successfully!");
      } else {
        setMessage(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Network or server error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white border-4 border-black rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Invite Employee</h2>
      <input
        type="email"
        placeholder="employee@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border-2 border-black px-4 py-2 rounded mb-4"
      />
      <button
        onClick={sendInvite}
        disabled={loading}
        className="w-full bg-black text-white font-bold py-2 rounded hover:opacity-90"
      >
        {loading ? "Sending..." : "Send Invite"}
      </button>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
