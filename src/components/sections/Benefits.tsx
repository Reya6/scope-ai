"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import icon1 from "@/components/images/icon1.png";
import icon2 from "@/components/images/icon2.png";
import icon3 from "@/components/images/icon3.png";
import icon4 from "@/components/images/icon4.png";

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="w-full bg-[#151617] min-h-[150vh] flex items-center px-6 md:px-12 py-16"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold leading-tight text-white text-center h-montserrat tracking-[-0.035em] mt-4"
        >
          User Benefits
        </motion.h2>

        {/* Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Benefit 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-2"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={icon1}
                alt="Save Time & Mitigate Risk Icon"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white h-montserrat tracking-[-0.035em] mt-4">
              Save Time & Mitigate Risk
            </h3>
            <p className="text-base md:text-lg text-white leading-snug max-w-md">
              Test campaign copy rigorously before deployment, eliminating
              costly mistakes and ensuring optimal performance from the start.
            </p>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-2"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={icon2}
                alt="Boost Deliverability & Replies Icon"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white h-montserrat tracking-[-0.035em] mt-4">
              Boost Deliverability & Replies
            </h3>
            <p className="text-base md:text-lg text-white leading-snug max-w-md">
              Receive actionable rewrite suggestions that enhance message
              clarity, increase engagement, and significantly improve your
              overall reply rates.
            </p>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-2"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={icon3}
                alt="Accelerate A/B Ideation Icon"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white  h-montserrat tracking-[-0.035em] mt-4">
              Accelerate A/B Ideation
            </h3>
            <p className="text-base md:text-lg text-white leading-snug max-w-md">
              Instantly generate high-quality campaign variants, streamlining
              your testing process and accelerating optimization cycles.
            </p>
          </motion.div>

          {/* Benefit 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-2"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={icon4}
                alt="Explainable Outcomes Icon"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white  h-montserrat tracking-[-0.035em] mt-4">
              Explainable Outcomes
            </h3>
            <p className="text-base md:text-lg text-white leading-snug max-w-md">
              Understand precisely why a campaign scored low and what specific
              changes were made to improve its performance, building trust and
              clarity.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
