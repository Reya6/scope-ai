"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import pic1 from "@/components/images/pic 1.png";

export default function Simulator() {
  return (
    <section id="simulator" className="w-full bg-[#f2ded0] py-12 px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto bg-[#f8ece4] border-4 border-black rounded-none p-8 md:p-10 my-12">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold leading-tight text-black text-center underline underline-offset-4 decoration-black h-montserrat tracking-[-0.035em] mt-4"
        >
          Campaign Simulator
        </motion.h2>

        {/* Paragraph (full width, above bullets) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 text-lg md:text-xl leading-relaxed text-black max-w-3xl"
        >
          The Campaign Simulator accepts your campaign inputs—subject line, body
          content, and recipient personas. It then runs a sophisticated
          simulation, returning critical performance metrics with confidence
          intervals.
        </motion.p>

        {/* Bullets + Image side by side */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Bullet Points (Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-extrabold text-black h-montserrat tracking-[-0.035em]">
              Key Outputs:
            </h3>
            <ul className="list-disc list-inside mt-4 space-y-3 text-black text-base md:text-lg leading-relaxed">
              <li>Open, Reply, Spam, Click, Unsubscribe, and Forward rates</li>
              <li>Wilson Score Confidence Intervals (CI) for each metric</li>
              <li>
                Per-persona rationales explaining likely response behaviors
              </li>
              <li>Small sample of simulated responses for enhanced UX</li>
            </ul>
          </motion.div>

          {/* Image (Right) */}
          <div className="flex justify-center md:justify-end">
            <div className="w-[300px] h-[300px] flex items-center justify-center">
              <Image
                src={pic1}
                alt="Campaign Simulator Preview"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
