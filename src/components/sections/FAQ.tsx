"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "What types of marketing campaigns does your platform support?",
    answer:
      "Our platform supports a wide range of marketing campaigns, including email marketing, social media advertising, search engine marketing (SEM), content marketing, and influencer outreach. We also offer features for A/B testing and personalized campaign deployment.",
  },
  {
    question:
      "How does your platform ensure campaign data privacy and security?",
    answer:
      "We prioritize data privacy and security through end-to-end encryption, multi-factor authentication, and regular security audits. Our platform is compliant with GDPR, CCPA, and other relevant data protection regulations to ensure your campaign data is always safe and secure.",
  },
  {
    question: "What kind of analytics and reporting features are available?",
    answer:
      "Our platform provides comprehensive analytics and reporting features, including real-time campaign performance tracking, audience engagement metrics, conversion rates, and ROI analysis. Customizable dashboards and automated reports help you gain actionable insights.",
  },
  {
    question: "Is your platform suitable for small businesses and enterprises?",
    answer:
      "Absolutely. Our platform is designed to be scalable and flexible, catering to the needs of both small businesses and large enterprises. We offer various pricing tiers and customizable features to match your specific business requirements.",
  },
  {
    question: "How do you handle customer support and technical assistance?",
    answer:
      "We offer 24/7 customer support through multiple channels, including live chat, email, and phone. Our dedicated support team is ready to assist you with any technical issues, platform queries, or campaign optimization advice you may need.",
  },
  {
    question:
      "Can I collaborate with my team members on campaigns within the platform?",
    answer:
      "Yes, our platform facilitates team collaboration with features like shared dashboards, project management tools, and role-based access control. You can easily assign tasks, track progress, and communicate with your team members in real-time.",
  },
  {
    question: "What are the pricing plans for your marketing platform?",
    answer:
      "We offer flexible pricing plans, including a free trial, a basic plan for startups, a professional plan for growing businesses, and an enterprise plan for large organizations. Each plan offers different features and usage limits, which can be viewed on our pricing page.",
  },
  {
    question: "How often are new features and updates released?",
    answer:
      "We are committed to continuous improvement and regularly release new features and updates to enhance our platform's capabilities. Major updates are typically rolled out quarterly, with minor enhancements and bug fixes deployed on a bi-weekly basis.",
  },
  {
    question: "Do you offer training or onboarding for new users?",
    answer:
      "Yes, we provide comprehensive training and onboarding resources for all new users. This includes video tutorials, detailed documentation, live webinars, and personalized one-on-one sessions with our success team to help you get started and maximize your use of the platform.",
  },
  {
    question: "How can I provide feedback or suggest new features?",
    answer:
      "We highly value user feedback! You can submit your suggestions directly by contacting our support team. We regularly review all feedback to inform our product roadmap and continuously improve the user experience.",
  },
];

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#dcdad5] py-20 px-6 md:px-12 text-black"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-10 h-montserrat text-left">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-black pb-4">
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg md:text-xl font-bold h-montserrat">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndexes.includes(index) ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight size={20} />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndexes.includes(index) && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-3 text-base md:text-lg font-normal leading-relaxed font-mono"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
