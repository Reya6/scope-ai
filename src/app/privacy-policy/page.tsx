"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex justify-center">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[#E26D5A] mb-8">
          Terms of Service
        </h1>

        <p className="text-gray-300 mb-6">
          <strong>Last updated:</strong> October 11, 2025
        </p>

        <p className="text-gray-300 mb-6">
          Welcome to <strong>Scope AI</strong>. These Terms of Service govern
          your access and use of our platform, tools, and services. By using
          Scope AI, you agree to these terms, our Privacy Policy, and Refund
          Policy.
        </p>

        {/* SECTION 1 — ACCEPTANCE */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-300 mb-6">
          By creating an account or using Scope AI, you confirm that you are at
          least 18 years old and legally able to enter into this agreement.
          Continued use of our services means you agree to the most recent
          version of these Terms.
        </p>

        {/* SECTION 2 — USE OF PLATFORM */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          2. Use of Our Platform
        </h2>
        <p className="text-gray-300 mb-6">
          You agree to use Scope AI only for lawful purposes. You may not
          reverse-engineer, redistribute, or misuse our AI tools or simulation
          features in any way that violates applicable laws or intellectual
          property rights.
        </p>

        {/* SECTION 3 — ACCOUNTS & SECURITY */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          3. Accounts and Security
        </h2>
        <p className="text-gray-300 mb-6">
          Users must maintain the confidentiality of their login credentials.
          Scope AI is not responsible for unauthorized access due to user
          negligence. You agree to notify us immediately if you suspect account
          misuse.
        </p>

        {/* SECTION 4 — PRIVACY POLICY */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          4. Privacy Policy
        </h2>
        <p className="text-gray-300 mb-6">
          We value your privacy. We collect limited information such as email,
          account data, and usage activity to operate and improve our platform.
          We do not sell your information to third parties. For full details,
          contact us at{" "}
          <span className="text-[#E26D5A]">support@scopeai.com</span>.
        </p>

        {/* SECTION 5 — PAYMENTS & REFUNDS */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          5. Payments and Refund Policy
        </h2>
        <p className="text-gray-300 mb-6">
          Payments for Scope AI subscriptions or simulations are processed
          securely through our payment partners (such as Paddle or Payoneer).
          Refunds are granted within <strong>15days</strong> of purchase.
        </p>

        {/* SECTION 6 — INTELLECTUAL PROPERTY */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          6. Intellectual Property
        </h2>
        <p className="text-gray-300 mb-6">
          All platform content, including AI-generated materials, branding, and
          designs, are the property of Scope AI. You may not use them for
          commercial purposes without written permission.
        </p>

        {/* SECTION 7 — LIABILITY DISCLAIMER */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          7. Disclaimer of Warranties and Liability
        </h2>
        <p className="text-gray-300 mb-6">
          Scope AI is provided “as is” without any warranties, express or
          implied. We are not liable for any losses resulting from the use of
          AI-generated simulations, including business or campaign outcomes.
        </p>

        {/* SECTION 8 — TERMINATION */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          8. Account Termination
        </h2>
        <p className="text-gray-300 mb-6">
          We reserve the right to suspend or terminate accounts that violate
          these Terms, engage in misuse, or harm the platform’s integrity.
        </p>

        {/* SECTION 9 — CONTACT */}
        <h2 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          9. Contact & Support
        </h2>
        <p className="text-gray-300 mb-6">
          For questions, account help, or legal inquiries, contact us at{" "}
          <span className="text-[#E26D5A]">6reya66@gmail.com</span>.
        </p>

        <div className="mt-10">
          <Link
            href="/workstation"
            className="text-[#E26D5A] hover:underline font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
