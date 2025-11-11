"use client";

import { motion } from "framer-motion";

export default function Capabilities() {
  return (
    <section id="capabilities" className="bg-[#f8ece4] py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small Heading */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl font-bold  text-black uppercase  h-montserrat tracking-[-0.035em] mt-4"
        >
          Detailed Capabilities
        </motion.h3>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-3 text-3xl md:text-5xl font-extrabold text-black leading-tight font-montserrat  h-montserrat tracking-[-0.035em] "
        >
          Improvement Engine (Rewrite + Fixes)
        </motion.h2>

        {/* Intro Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-black font-inconsolata leading-snug"
        >
          When simulation metrics are low, the Improvement Engine steps in to
          suggest actionable fixes. It identifies issues and provides targeted
          recommendations to enhance your campaign's performance and increase
          reply rates.
        </motion.p>

        {/* Capabilities Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 place-items-center">
          {/* Box 1 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#f2ded0] border-2 border-black p-6 md:p-8 rounded-none text-left shadow-sm hover:scale-[1.02] transition-all duration-300 ease-in-out w-full h-full"
          >
            <h3 className="text-xl font-bold text-black mb-2 leading-snug font-montserrat  h-montserrat tracking-[-0.035em] mt-4">
              Spam Word Removal
            </h3>
            <p className="text-base md:text-lg text-black font-inconsolata leading-snug">
              Identifies and highlights spammy words, suggesting replacements to
              improve deliverability.
            </p>
          </motion.div>

          {/* Box 2 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-[#f2ded0] border-2 border-black p-6 md:p-8 rounded-none text-left shadow-sm hover:scale-[1.02] transition-all duration-300 ease-in-out w-full h-full"
          >
            <h3 className="text-xl font-bold text-black mb-2 leading-snug font-montserrat  h-montserrat tracking-[-0.035em] mt-4">
              Content Optimization
            </h3>
            <p className="text-base md:text-lg text-black font-inconsolata leading-snug">
              Suggests shortening overly long subjects and bodies, providing
              clear before-and-after comparisons.
            </p>
          </motion.div>

          {/* Box 3 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#f2ded0] border-2 border-black p-6 md:p-8 rounded-none text-left shadow-sm hover:scale-[1.02] transition-all duration-300 ease-in-out w-full h-full"
          >
            <h3 className="text-xl font-bold text-black mb-2 leading-snug font-montserrat  h-montserrat tracking-[-0.035em] mt-4">
              Personalization Boost
            </h3>
            <p className="text-base md:text-lg text-black font-inconsolata leading-snug">
              Recommends increasing the use of personalization tokens (e.g.,{" "}
              {"{{firstName}}"}, {"{{company}}"}).
            </p>
          </motion.div>

          {/* Box 4 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-[#f2ded0] border-2 border-black p-6 md:p-8 rounded-none text-left shadow-sm hover:scale-[1.02] transition-all duration-300 ease-in-out w-full h-full"
          >
            <h3 className="text-xl font-bold text-black mb-2 leading-snug font-montserrat  h-montserrat tracking-[-0.035em] mt-4">
              Rewrite Styles
            </h3>
            <p className="text-base md:text-lg text-black font-inconsolata leading-snug">
              Offers 3 distinct rewrite styles: casual, professional, and
              concise, to match your brand voice.
            </p>
          </motion.div>

          {/* Box 5 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-[#f2ded0] border-2 border-black p-6 md:p-8 rounded-none text-left shadow-sm hover:scale-[1.02] transition-all duration-300 ease-in-out w-full h-full"
          >
            <h3 className="text-xl font-bold text-black mb-2 leading-snug font-montserrat  h-montserrat tracking-[-0.035em] mt-4">
              Subject Line Optimization
            </h3>
            <p className="text-base md:text-lg text-black font-inconsolata leading-snug">
              Generates 3–5 subject lines specifically optimized for higher open
              rates.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
