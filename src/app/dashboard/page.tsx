"use client";

import Navbar from "@/components/Navbar";
import Workstation from "@/components/workstation/Workstation";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-6">
        <Workstation />
      </main>
    </div>
  );
}
