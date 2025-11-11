// src/components/sections/Capabilities2.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import pic2 from "@/components/images/pic 2.jpg";

export default function Capabilities2() {
  return (
    <section
      id="ab-variant"
      className="w-full bg-black text-white py-32 px-6 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Small Heading */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-xl font-semibold uppercase text-white text-center tracking-[-0.02em]"
        >
          Detailed Capabilities
        </motion.h3>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-extrabold leading-tight text-white text-center h-montserrat tracking-[-0.035em] mt-4"
        >
          A/B Variant Generator & Comparator
        </motion.h2>

        {/* Description (clamped to 2 lines) */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          viewport={{ once: true }}
          className="mt-8 text-lg md:text-xl leading-snug text-center mx-auto tracking-[-0.02em]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxWidth: "80ch",
          }}
        >
          Accelerate your testing strategy with our A/B Variant Generator. This
          feature automatically produces multiple campaign variants and
          simulates each one, showing delta metrics and identifying the
          best-performing option.
        </motion.p>

        {/* Two-column area: bullets (left) + image (right) */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Bullet list */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4 text-base md:text-lg leading-tight tracking-[-0.02em] z-10 relative"
          >
            <li className="list-disc list-inside">
              Auto-generate diverse campaign variants.
            </li>
            <li className="list-disc list-inside">
              Simulate each variant to predict performance.
            </li>
            <li className="list-disc list-inside">
              Display clear delta metrics for easy comparison.
            </li>
            <li className="list-disc list-inside">
              Identify the top-performing variant for immediate use.
            </li>
          </motion.ul>

          {/* Right: Image (replaces placeholder) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            viewport={{ once: true }}
            className="w-full h-[420px] md:h-[520px] flex items-center justify-center relative z-0"
          >
            <Image
              src={pic2}
              alt="A/B Variant Generator Preview"
              fill
              className="object-cover rounded-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
