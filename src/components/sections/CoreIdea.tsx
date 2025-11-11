// src/components/sections/CoreIdea.tsx

"use client";

import { motion } from "framer-motion";

export default function CoreIdea() {
  return (
    <section
      id="core-idea"
      className="w-full bg-[#bab6aa] text-black py-24 px-4 md:px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-1xl md:text-2xl font-extrabold leading-tight text-center  h-montserrat tracking-[-0.035em] mt-4 "
        >
          The Core Idea
        </motion.h2>

        {/* Subheading */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black  h-montserrat tracking-[-0.035em] mt-4"
        >
          Simulate. Optimize. Succeed.
        </motion.h3>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-4 text-sm md:text-base leading-relaxed max-w-7xl"
        >
          This web app simulates cold outreach campaigns (email, LinkedIn, DMs)
          using advanced LLMs and domain rules. It generates realistic metrics
          like open, reply, spam, click, unsubscribe, and forward rates without
          sending a single message. The platform then auto-suggests intelligent
          improvements, including rewrites, subject lines, personalization
          enhancements, and A/B variants, all to maximize your campaign&apos;s
          effectiveness.
        </motion.p>
      </div>
    </section>
  );
}
