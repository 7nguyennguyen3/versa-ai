"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Import Link

// Animation variants (optional)
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};

const PrivacyPolicyPage = () => {
  // Set date manually or fetch from CMS. Avoid new Date() directly in render for SSR/hydration.
  // Current time is Monday, April 14, 2025 at 1:01:28 PM PDT.
  const lastUpdatedDate = "April 14, 2025"; // <-- **MANUALLY UPDATE THIS DATE WHEN POLICY CHANGES**

  return (
    // Consistent background, top alignment, padding
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 py-16 md:py-24 flex flex-col items-center justify-start">
      {/* Content container with white background and shadow */}
      <div className="w-full max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-lg rounded-lg border border-gray-200/80">
        {/* Header */}
        <motion.div
          className="mb-8 pb-4 border-b border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: {lastUpdatedDate}
          </p>
        </motion.div>
        {/* Introduction */}
        <motion.section
          className="mb-8 prose prose-slate max-w-none prose-sm md:prose-base prose-a:text-blue-600 hover:prose-a:underline"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <p>
            Welcome to Versa AI (&quot;Company&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;). We are committed to protecting
            your personal information and your right to privacy. This privacy
            notice explains how we collect, use, disclose, and safeguard your
            information when you visit our website{" "}
            <a
              href="https://versa-ai.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://versa-ai.co
            </a>{" "}
            (the &quot;Website&quot;), use our web application (the &quot;Versa
            AI Platform&quot;), or otherwise engage with us (collectively, the
            &quot;Services&quot;).
          </p>
          <p>
            Please read this privacy notice carefully. Reading it will help you
            understand your privacy rights and choices. **If you do not agree
            with our policies and practices, please do not use our Services.**
            If you still have any questions or concerns, please contact us at{" "}
            <a href="mailto:hello@versai.com">hello@versai.com</a>.
          </p>
          {/* --- DISCLAIMER --- */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 not-prose">
            <strong className="font-bold">Legal Disclaimer:</strong> This
            document is a template and does not constitute legal advice. Versa
            AI (or the user implementing this) must consult with qualified legal
            counsel to ensure this policy is accurate, complete, and compliant
            with all applicable laws (GDPR, CCPA, etc.) before publication and
            use. Do not rely solely on this template.
          </div>
          {/* --- END DISCLAIMER --- */}
        </motion.section>
        {/* Use prose class for default styling of generated HTML */}
        <div
          className="prose prose-slate max-w-none prose-sm md:prose-base 
        prose-headings:font-semibold prose-headings:text-gray-800 prose-h2:text-2xl
        prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:underline
        prose-ul:list-disc prose-ul:pl-6 prose-li:my-1"
        >
          {/* Section 1: Information We Collect */}
          <motion.section
            id="information-collected"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>1. What Information We Collect</h2>
            <p>We collect information in the following ways:</p>
            <h3>a. Information You Provide to Us</h3>
            <p>
              This includes personal information you provide when you register
              for an account, use our Services, make a purchase, contact
              customer support, or otherwise communicate with us. This may
              include:
            </p>
            <ul>
              <li>
                <strong>Contact Data:</strong> Name, email address, phone
                number.
              </li>
              <li>
                <strong>Account Credentials:</strong> Username, password (stored
                hashed), security questions/answers.
              </li>
              <li>
                <strong>Payment Data:</strong> Billing address, payment card
                details (processed securely by our third-party payment
                processor: [**Specify Payment Processor, e.g., Stripe**] - we do
                not store full card numbers).
              </li>
              <li>
                <strong>Content Data:</strong> Documents (e.g., PDFs) and any
                associated text or data you upload or generate while using the
                Services (e.g., chat history, summaries).
              </li>
              <li>
                <strong>Communication Data:</strong> Information you provide
                when you contact support or communicate with us.
              </li>
            </ul>
            <h3>b. Information We Collect Automatically</h3>
            <p>
              When you use our Services, we may automatically collect certain
              information about your device and usage, including:
            </p>
            <ul>
              <li>
                <strong>Log and Usage Data:</strong> IP address, browser type,
                operating system, device information, pages visited, time spent
                on pages, links clicked, features used, error logs.
              </li>
              <li>
                <strong>Cookies and Similar Technologies:</strong> We use
                cookies and similar tracking technologies to operate and
                personalize the Services, analyze usage, and for security
                purposes. For more details, please see our [**Link to Cookie
                Policy - Create this page/link**].
              </li>
            </ul>
            <h3>c. AI Model Training Data</h3>
            <p>
              **We do not use your uploaded documents or the specific content of
              your private interactions (questions and answers within your
              secure sessions) to train our general-purpose AI models.** Your
              content is processed solely to provide the requested features and
              responses within the Services. We may utilize strictly anonymized
              and aggregated usage patterns (which do not contain personal data
              or your specific content) to improve system performance,
              reliability, and overall service quality. Data usage for optional,
              explicitly opt-in features or specific Enterprise agreements may
              differ and will be clearly outlined separately. [**REVIEW &
              CONFIRM THIS POLICY WITH LEGAL COUNSEL**]
            </p>
          </motion.section>

          {/* Section 2: How We Use Your Information */}
          <motion.section
            id="how-we-use"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>To provide, operate, maintain, and improve our Services.</li>
              <li>To process transactions and manage your subscription.</li>
              <li>
                To set up and manage your user account and authentication.
              </li>
              <li>
                To analyze your documents and generate AI responses as requested
                by you.
              </li>
              <li>
                To communicate with you, including responding to support
                requests and sending administrative or service-related
                announcements.
              </li>
              <li>
                To send marketing communications (with your consent, where
                required, and offering opt-out options).
              </li>
              <li>
                To monitor and analyze usage trends and activities to improve
                the Services.
              </li>
              <li>
                To detect and prevent fraudulent activities and ensure the
                security of our Services.
              </li>
              <li>
                To comply with legal obligations and enforce our terms and
                policies.
              </li>
            </ul>
          </motion.section>

          {/* Section 3: Sharing Your Information */}
          <motion.section
            id="sharing-information"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>3. How We Share Your Information</h2>
            <p>
              We do not sell your personal information. We may share your
              information only in the following limited circumstances:
            </p>
            <ul>
              <li>
                <strong>With Service Providers:</strong> We share information
                with third-party vendors and service providers who perform
                services on our behalf (e.g., cloud hosting [**Specify Provider,
                e.g., AWS, Google Cloud**], payment processing [**Specify
                Processor**], email delivery, analytics, customer support).
                These providers are contractually obligated to protect your
                information and use it only for the services they provide to us.
              </li>
              <li>
                <strong>For Legal Reasons:</strong> We may disclose information
                if required by law, subpoena, or other legal process, or if we
                believe in good faith that disclosure is necessary to protect
                our rights, protect your safety or the safety of others,
                investigate fraud, or respond to a government request.
              </li>
              <li>
                <strong>During Business Transfers:</strong> If Versa AI is
                involved in a merger, acquisition, financing, or sale of all or
                a portion of its assets, your information may be transferred as
                part of that transaction, subject to standard confidentiality
                agreements.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your
                information for other purposes if you have given us your
                explicit consent to do so.
              </li>
            </ul>
          </motion.section>

          {/* Section 4: Data Security */}
          <motion.section
            id="data-security"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security
              measures designed to protect the security and integrity of the
              information we process. This includes measures like encryption of
              data at rest and in transit, access controls, secure network
              configurations, and regular security assessments. However, please
              remember that no method of transmission over the Internet or
              method of electronic storage is 100% secure. While we strive to
              use commercially acceptable means to protect your personal
              information, we cannot guarantee its absolute security.
            </p>
          </motion.section>

          {/* Section 5: Data Retention */}
          <motion.section
            id="data-retention"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>5. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is
              necessary for the purposes set out in this privacy notice, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting, or other legal requirements). Generally, this
              means we retain your account information for as long as your
              account is active and for a reasonable period thereafter in case
              you decide to re-activate the Services, or as needed to resolve
              disputes, enforce our agreements, and comply with our legal
              obligations.
            </p>
            <p>
              Uploaded documents and chat history associated with your account
              are retained according to your plan level or specific settings,
              and may be deleted sooner if you manually delete them or close
              your account. [**Specify retention details or link to data
              handling docs if applicable**]
            </p>
          </motion.section>

          {/* Section 6: Your Privacy Rights */}
          <motion.section
            id="your-rights"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>6. Your Privacy Rights</h2>
            <p>
              Depending on your location and applicable laws (e.g., GDPR for
              European residents, CCPA for California residents), you may have
              rights regarding your personal information, including the right to
              access, correct, update, delete, or restrict the processing of
              your personal information. You may also have the right to data
              portability and the right to withdraw consent.
            </p>
            <p>
              You can typically manage your account information and some privacy
              settings directly within your account settings page. For other
              requests or to exercise your rights, please contact us using the
              information in the &quot;Contact Us&quot; section below. We will
              respond to your request in accordance with applicable law.
            </p>
            <p>
              [**Include specific details required by GDPR/CCPA, e.g., details
              on Data Protection Officer (if applicable), right to lodge a
              complaint with a supervisory authority, CCPA categories of data
              collected/shared, &apos;Do Not Sell&apos; info (if applicable,
              though stated not selling). CONSULT LEGAL COUNSEL.**]
            </p>
          </motion.section>

          {/* Section 7: International Transfers */}
          <motion.section
            id="international-transfers"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>7. International Data Transfers</h2>
            <p>
              Your information may be transferred to — and maintained on —
              computers located outside of your state, province, country, or
              other governmental jurisdiction where the data protection laws may
              differ from those in your jurisdiction. If you are located outside
              the United States and choose to provide information to us, please
              note that we transfer the data, including personal information, to
              the United States and process it there. [**Specify other locations
              if applicable**]. We will take steps reasonably necessary to
              ensure that your data is treated securely and in accordance with
              this privacy notice. [**Mention specific transfer mechanisms like
              Standard Contractual Clauses if required, especially for GDPR.
              CONSULT LEGAL COUNSEL.**]
            </p>
          </motion.section>

          {/* Section 8: Children's Privacy */}
          <motion.section
            id="childrens-privacy"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>8. Children&apos;s Privacy</h2>
            <p>
              Our Services are not directed to individuals under the age of
              [**Specify Age, e.g., 13 or 16 depending on regulations**]. We do
              not knowingly collect personal information from children under
              that age. If we become aware that we have collected personal
              information from a child under the relevant age without
              verification of parental consent, we will take steps to remove
              that information from our servers.
            </p>
          </motion.section>

          {/* Section 9: Changes to This Policy */}
          <motion.section
            id="changes-policy"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy notice from time to time. The updated
              version will be indicated by an updated &quot;Last Updated&quot;
              date and the updated version will be effective as soon as it is
              accessible. If we make material changes to this privacy notice, we
              may notify you either by prominently posting a notice of such
              changes or by directly sending you a notification. We encourage
              you to review this privacy notice frequently to be informed of how
              we are protecting your information.
            </p>
          </motion.section>

          {/* Contact Us Section - UPDATED */}
          <motion.section
            id="contact-us"
            className="mt-10 pt-6 border-t border-gray-200"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>10. Contact Us</h2>
            <p>
              If you have questions or comments about this notice, or wish to
              exercise your privacy rights, you may email our Privacy Team at{" "}
              <a href="mailto:hello@versai.com">hello@versai.com</a> or contact
              us by post at:
            </p>
            <address className="mt-3 not-italic text-sm leading-relaxed">
              Versa AI <br />
              123 AI Street, Suite 404 <br />
              Tech City, California, 90210 <br />
              United States
            </address>
          </motion.section>
        </div>{" "}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
