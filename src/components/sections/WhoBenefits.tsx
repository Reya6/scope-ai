// src/components/sections/WhoBenefits.tsx
"use client";

import { motion } from "framer-motion";

export default function WhoBenefits() {
  return (
    <section
      id="who-benefits"
      className="w-full bg-[#f2ded0] min-h-[50vh] flex items-center px-6 md:px-12 py-8"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Small top label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="text-sm text-black/90 text-center  h-montserrat tracking-[-0.035em] mt-4"
        >
          Who Benefits Most?
        </motion.p>

        {/* Big centered heading (Montserrat) */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          viewport={{ once: true }}
          className=" text-3xl md:text-5xl font-extrabold text-black text-center  h-montserrat tracking-[-0.035em] mt-4"
        >
          Target Users
        </motion.h2>

        {/* Optional short description could go here (omitted per spec) */}

        {/* 2x2 bullets grid (left: two items, right: two items) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12"
        >
          {/* Left column (two bullets) */}
          <div className="flex flex-col gap-6">
            <div className="max-w-md">
              <ul className="list-disc list-inside marker:text-black">
                <li className="text-base md:text-lg text-black leading-normal">
                  Growth &amp; Sales teams, including SDRs
                </li>
              </ul>
            </div>

            <div className="max-w-md">
              <ul className="list-disc list-inside marker:text-black">
                <li className="text-base md:text-lg text-black leading-normal">
                  Founders actively engaged in outbound outreach
                </li>
              </ul>
            </div>
          </div>

          {/* Right column (two bullets) */}
          <div className="flex flex-col gap-6">
            <div className="max-w-md">
              <ul className="list-disc list-inside marker:text-black">
                <li className="text-base md:text-lg text-black leading-normal">
                  Marketing teams executing cold campaigns
                </li>
              </ul>
            </div>

            <div className="max-w-md">
              <ul className="list-disc list-inside marker:text-black">
                <li className="text-base md:text-lg text-black leading-normal">
                  Agencies requiring rapid validation for numerous campaign
                  variations
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
