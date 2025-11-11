"use client";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();

  const handleGetStarted = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEnterprise = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/enterprise-access"); // we'll make this page next
  };

  return (
    <section
      id="pricing"
      className="w-full bg-[#f8ece4] py-24 px-6 md:px-12 text-black"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center h-montserrat mb-16 tracking-[-0.035em] mt-4">
          Choose Your Plan
        </h2>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Free Trial Plan */}
          <div className="bg-[#f8ece4] border-[4px] border-black p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold h-montserrat text-center">
                Free Trial
              </h3>
              <p className="text-base text-center mt-1 font-mono">
                3 days free
              </p>
              <div className="border-t border-gray-500 my-6"></div>
              <ul className="list-disc list-inside space-y-2 text-base font-mono text-left pl-4">
                <li>Limited simulations</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
            </div>

            <a
              href="#hero"
              onClick={handleGetStarted}
              className="mt-8 block bg-black text-white text-center py-3 rounded-[3px] font-bold hover:opacity-90 transition"
            >
              Get Started
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#f8ece4] border-[4px] border-black p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold h-montserrat text-center">
                Enterprise Plan
              </h3>
              <p className="text-base text-center mt-1 font-mono">
                Custom pricing
              </p>
              <div className="border-t border-gray-500 my-6"></div>
              <ul className="list-disc list-inside space-y-2 text-base font-mono text-left pl-4">
                <li>Unlimited simulations</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom integrations</li>
                <li>Dedicated account manager</li>
              </ul>
            </div>

            <a
              href="/enterprise-access"
              onClick={handleEnterprise}
              className="mt-8 block bg-black text-white text-center py-3 rounded-[3px] font-semibold hover:opacity-90 transition"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
      {/* Footer Link */}
      <div className="text-center mt-16 text-sm font-mono text-gray-600">
        <a
          href="/privacy-policy"
          className="underline hover:text-black transition"
        >
          Terms of Service / Privacy Policy
        </a>
      </div>
    </section>
  );
}
