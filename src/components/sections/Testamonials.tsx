"use client";

import Image from "next/image";
import logo1 from "@/components/images/logo1.png";
import logo2 from "@/components/images/logo2.jpg";
import logo3 from "@/components/images/logo3.png";
import logo4 from "@/components/images/logo4.png";
import logo5 from "@/components/images/logo5.png";

export default function Testimonials() {
  const testimonials = [
    {
      text: `"Our marketing efforts have never been more streamlined. The platform's automation features saved us countless hours and significantly boosted our ROI."`,
      name: "Sarah Chen",
      company: "Apex Innovations",
      image: logo1,
    },
    {
      text: `"The analytics dashboards are incredibly insightful. We can now pinpoint exactly what works and optimize our campaigns with real-time data."`,
      name: "David Miller",
      company: "Global Solutions Inc.",
      image: logo2,
    },
    {
      text: `"Customer support is top-notch. Any question we had was answered quickly and effectively, making our onboarding process incredibly smooth."`,
      name: "Emily Rodriguez",
      company: "Bright Future Marketing",
      image: logo3,
    },
    {
      text: `"Scalability was a major concern for us, but this platform handled our rapid growth effortlessly. It truly adapts to our evolving needs."`,
      name: "Ben Carter",
      company: "Horizon Enterprises",
      image: logo4,
    },
    {
      text: `"The collaborative tools are a game-changer. Our team can now work seamlessly across different projects, improving efficiency and communication."`,
      name: "Jessica Lee",
      company: "Synergy Tech",
      image: logo5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="w-full bg-black text-white py-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 h-montserrat">
          What Our Customers Say
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="w-full max-w-sm border-[4px] border-white p-6 text-left flex flex-col items-start bg-transparent"
            >
              {/* Image (fills box completely) */}
              <div className="w-24 h-24 mb-4 relative overflow-hidden border border-white">
                <Image
                  src={t.image}
                  alt={`${t.company} Logo`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Review */}
              <p className="text-base md:text-lg leading-relaxed font-mono">
                {t.text}
              </p>

              {/* Name & Company */}
              <p className="mt-4 text-lg font-bold text-white h-montserrat">
                {t.name}
              </p>
              <p className="text-sm text-gray-300 font-mono">{t.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
