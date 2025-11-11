// src/app/page.tsx
"use client";

import Hero from "@/components/sections/Hero";
import CoreIdea from "@/components/sections/CoreIdea";
import Simulator from "@/components/sections/Simulator";
import Benefits from "@/components/sections/Benefits";
import WhoBenefits from "@/components/sections/WhoBenefits";
import Capabilities from "@/components/sections/Capabilities";
import Capabilities2 from "@/components/sections/Capabilities2";
import History from "@/components/sections/History";
import FAQ from "@/components/sections/FAQ";
import Testamonials from "@/components/sections/Testamonials";
import Pricing from "@/components/sections/Pricing";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      {/* Top sections */}
      <Hero />
      <CoreIdea />
      <Simulator />

      {/* Rest of your landing sections */}
      <Benefits />
      <WhoBenefits />
      <Capabilities />
      <Capabilities2 />
      <History />
      <FAQ />
      <Testamonials />
      <Pricing />
      <Navbar />
    </>
  );
}
