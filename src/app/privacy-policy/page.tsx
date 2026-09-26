"use client";

import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-[#E26D5A] mb-4">
          Scope AI â€” Terms & Privacy
        </h1>

        <p className="text-gray-400 mb-10">
          <strong>Last updated:</strong> September 23, 2026
        </p>

        {/* TERMS OF SERVICE */}

        <h2 className="text-3xl font-bold text-[#E26D5A] mt-8 mb-6">
          Terms of Service
        </h2>

        <p className="text-gray-300 mb-6">
          Welcome to <strong>Scope AI</strong>. These Terms of Service govern
          your access to and use of the Scope AI platform, campaign simulation
          tools, optimization features, Scope Tokens, and related services. By
          creating an account or using Scope AI, you agree to these Terms, our
          Privacy Policy, and our refund terms.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          1. Acceptance of Terms
        </h3>

        <p className="text-gray-300 mb-6">
          By creating an account or using Scope AI, you confirm that you are at
          least 18 years old and legally able to enter into this agreement. If
          you do not agree with these Terms, you should not use the platform.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          2. Scope AI Services
        </h3>

        <p className="text-gray-300 mb-6">
          Scope AI provides AI-powered campaign simulation and optimization
          tools designed to help users evaluate outreach campaigns before
          sending them. The platform may provide estimated engagement metrics,
          campaign analysis, optimization suggestions, A/B variants, and example
          responses.
        </p>

        <p className="text-gray-300 mb-6">
          Scope AI simulations and AI-generated recommendations are estimates
          based on the information provided to the platform and the underlying
          AI systems. They do not guarantee actual campaign performance,
          response rates, conversions, revenue, deliverability, or other
          business outcomes.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          3. Acceptable Use
        </h3>

        <p className="text-gray-300 mb-6">
          You agree to use Scope AI only for lawful purposes and in accordance
          with applicable laws and regulations. You must not misuse the
          platform, attempt to gain unauthorized access, interfere with its
          operation, reverse-engineer protected components, or use the service
          in a way that infringes the rights of others.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          4. Accounts and Security
        </h3>

        <p className="text-gray-300 mb-6">
          You are responsible for maintaining the confidentiality of your
          account credentials and for activity performed through your account.
          You agree to notify us if you believe your account has been
          compromised or used without authorization.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          5. Scope Tokens
        </h3>

        <p className="text-gray-300 mb-6">
          Scope AI may provide customers with Scope Tokens that are used to
          access eligible AI-powered features. Token amounts, expiration dates,
          and usage rules may depend on the customer's plan or agreement.
        </p>

        <p className="text-gray-300 mb-6">
          Scope Tokens have no cash value, cannot be exchanged for cash, and
          cannot be transferred or resold unless expressly permitted by Scope
          AI.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          6. Payments and Billing
        </h3>

        <p className="text-gray-300 mb-6">
          Paid Scope AI plans are processed through <strong>Paddle</strong>,
          which acts as the Merchant of Record for transactions made through
          Paddle Checkout. Payment processing, applicable taxes, receipts, and
          payment-related services are handled through Paddle.
        </p>

        <p className="text-gray-300 mb-6">
          Scope AI does not directly store your full payment card details.
          Payment information is handled by the applicable payment provider.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          7. Refunds
        </h3>

        <p className="text-gray-300 mb-6">
          Scope AI offers a refund request period of{" "}
          <strong>15 days from the date of purchase</strong>, subject to
          applicable law and the terms governing the transaction.
        </p>

        <p className="text-gray-300 mb-6">
          Refund requests may be reviewed based on the transaction, account
          activity, usage of the service, and applicable payment-provider
          requirements. Nothing in this section limits any non-waivable rights
          you may have under applicable consumer-protection law.
        </p>

        <p className="text-gray-300 mb-6">
          Because Paddle processes Scope AI transactions, payment and refund
          requests may be handled through Paddle's customer support and refund
          process.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          8. Intellectual Property
        </h3>

        <p className="text-gray-300 mb-6">
          Scope AI and its associated software, branding, designs, interfaces,
          documentation, and other platform materials are owned by or licensed
          to Scope AI unless otherwise stated.
        </p>

        <p className="text-gray-300 mb-6">
          You retain responsibility for the content and campaign information you
          submit to the platform. You grant Scope AI the permissions reasonably
          necessary to process that information in order to provide the
          requested services.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          9. AI Results and Disclaimer
        </h3>

        <p className="text-gray-300 mb-6">
          Scope AI uses artificial intelligence to generate simulations,
          predictions, recommendations, and other outputs. AI-generated
          information may be incomplete, inaccurate, or different from actual
          real-world results.
        </p>

        <p className="text-gray-300 mb-6">
          You are responsible for reviewing AI-generated outputs before relying
          on them or using them in a real campaign or business decision.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          10. Availability and Changes
        </h3>

        <p className="text-gray-300 mb-6">
          We may modify, improve, suspend, or discontinue features of Scope AI
          from time to time. We may also update these Terms when reasonably
          necessary to reflect changes to the service, business, or applicable
          requirements.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          11. Account Suspension or Termination
        </h3>

        <p className="text-gray-300 mb-6">
          We may suspend or terminate access to an account where we reasonably
          believe the account is being used in violation of these Terms,
          applicable law, or in a manner that may harm the platform or other
          users.
        </p>

        {/* PRIVACY POLICY */}

        <h2 className="text-3xl font-bold text-[#E26D5A] mt-16 mb-6">
          Privacy Policy
        </h2>

        <p className="text-gray-300 mb-6">
          This Privacy Policy explains how Scope AI may collect, use, store, and
          protect information when you use our website and platform.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          1. Information We Collect
        </h3>

        <p className="text-gray-300 mb-6">
          Depending on how you use Scope AI, we may collect information such as
          your name, email address, account information, authentication
          information, campaign inputs, simulation activity, token usage, and
          information necessary to provide and secure the service.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          2. How We Use Information
        </h3>

        <p className="text-gray-300 mb-6">
          We may use information to create and manage accounts, provide Scope AI
          services, process simulations, maintain usage and token records,
          provide customer support, maintain security, prevent abuse, process
          payments through our payment provider, and improve the platform.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          3. Payment Information
        </h3>

        <p className="text-gray-300 mb-6">
          Payments are processed through Paddle. Paddle may collect and process
          information necessary to complete transactions, including billing and
          payment information. Scope AI does not need to receive or store your
          full payment card number in order to provide the service.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          4. AI and Campaign Data
        </h3>

        <p className="text-gray-300 mb-6">
          Campaign information submitted to Scope AI may be processed by the AI
          services used to provide simulation and optimization functionality. We
          use such information to provide the requested service and operate the
          platform.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          5. Service Providers
        </h3>

        <p className="text-gray-300 mb-6">
          We may use third-party service providers necessary to operate Scope
          AI, including authentication, hosting, database, AI, analytics, and
          payment providers. These providers may process information only as
          necessary to provide their services and according to their applicable
          terms and policies.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          6. Data Security
        </h3>

        <p className="text-gray-300 mb-6">
          We take reasonable technical and organizational measures to protect
          information against unauthorized access, misuse, alteration, or
          disclosure. However, no internet-based service can guarantee absolute
          security.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          7. Information Sharing
        </h3>

        <p className="text-gray-300 mb-6">
          We do not sell personal information as a business practice. We may
          share information with service providers, payment providers, or when
          required to comply with applicable law, protect our rights, prevent
          fraud or abuse, or protect the security of Scope AI and its users.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          8. Data Retention
        </h3>

        <p className="text-gray-300 mb-6">
          We retain information for as long as reasonably necessary to provide
          the service, maintain business and security records, comply with
          applicable legal obligations, resolve disputes, and enforce our
          agreements.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          9. Your Privacy Rights
        </h3>

        <p className="text-gray-300 mb-6">
          Depending on your location and applicable law, you may have rights
          relating to your personal information, including rights to request
          access, correction, deletion, or other forms of privacy-related
          assistance.
        </p>

        <h3 className="text-2xl font-semibold text-[#E26D5A] mt-10 mb-4">
          10. Updates to This Policy
        </h3>

        <p className="text-gray-300 mb-6">
          We may update this Privacy Policy from time to time. The updated
          version will be posted on this page with a revised "Last updated"
          date.
        </p>

        {/* CONTACT */}

        <h2 className="text-3xl font-bold text-[#E26D5A] mt-16 mb-6">
          Contact & Support
        </h2>

        <p className="text-gray-300 mb-6">
          For account help, privacy questions, legal inquiries, or support,
          contact us at{" "}
          <span className="text-[#E26D5A]">6reya66@gmail.com</span>.
        </p>

        <div className="mt-10 flex gap-6">
          <Link
            href="/workstation"
            className="text-[#E26D5A] hover:underline font-semibold"
          >
            â† Back to Dashboard
          </Link>

          <Link
            href="/"
            className="text-[#E26D5A] hover:underline font-semibold"
          >
            â† Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

