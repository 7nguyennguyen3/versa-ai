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

const TermsOfServicePage = () => {
  // Set date manually or fetch from CMS. Should match or be later than the effective date.
  // Current time is Monday, April 14, 2025 at 1:07:16 PM PDT. Location: Santa Ana, California, United States.
  const effectiveDate = "April 14, 2025"; // <-- **MANUALLY UPDATE THIS DATE**

  return (
    // Consistent background, top alignment, padding
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 py-16 md:py-24 flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-lg rounded-lg border border-gray-200/80">
        {/* Header */}
        <motion.div
          className="mb-8 pb-4 border-b border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Effective Date: {effectiveDate}
          </p>
        </motion.div>
        {/* Introduction & Disclaimer */}
        <motion.section
          className="mb-8 prose prose-slate max-w-none prose-sm md:prose-base prose-a:text-blue-600 hover:prose-a:underline"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <p>
            Welcome to Versa AI! These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of the website{" "}
            <a
              href="https://versa-ai.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://versa-ai.co
            </a>{" "}
            (the &quot;Website&quot;), our web application (&quot;Versa AI
            Platform&quot;), and related services (collectively, the
            &quot;Services&quot;) provided by Versa AI (&quot;Company&quot;,
            &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p>
            Please read these Terms carefully before using our Services. By
            accessing or using the Services, you agree to be bound by these
            Terms and our <Link href="/privacy-policy">Privacy Policy</Link>. If
            you do not agree to these Terms, you may not access or use the
            Services.
          </p>
          {/* --- LEGAL DISCLAIMER --- */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 not-prose">
            <strong className="font-bold">Legal Disclaimer:</strong> This is a
            template document and does not constitute legal advice. Versa AI
            must consult with qualified legal counsel to tailor this document to
            its specific business model, risks, and applicable laws before
            publication and use. Sections like Limitation of Liability,
            Disclaimers, and Governing Law require specific legal input.
          </div>
          {/* --- END DISCLAIMER --- */}
        </motion.section>
        {/* Use prose class for default styling of generated HTML */}
        <div className="prose prose-slate max-w-none prose-sm md:prose-base prose-headings:font-semibold prose-headings:text-gray-800 prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:underline prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-ol:list-decimal prose-ol:pl-6">
          {/* Section 1: Description of Service */}
          <motion.section
            id="description-service"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>1. Description of Service</h2>
            <p>
              Versa AI provides a platform utilizing artificial intelligence to
              help users interact with, analyze, and extract insights from
              documents (such as PDFs) and potentially other data sources they
              provide. Features may include, but are not limited to, AI-powered
              chat, document summarization, data extraction, and customizable AI
              interactions (&quot;Services&quot;).
            </p>
            <p>
              <strong>AI Limitations:</strong> You acknowledge that artificial
              intelligence is a rapidly evolving field. The responses generated
              by the Services are based on patterns in data and may not always
              be perfectly accurate, complete, or suitable for your specific
              purpose. You should independently verify critical information. We
              do not guarantee any specific outcomes from the use of the
              Services.
            </p>
          </motion.section>

          {/* Section 2: User Accounts */}
          <motion.section
            id="user-accounts"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>2. User Accounts</h2>
            <p>
              To access certain features of the Services, you may be required to
              register for an account. You agree to:
            </p>
            <ul>
              <li>
                Provide accurate, current, and complete information during
                registration.
              </li>
              <li>
                Maintain the security of your password and accept all risks of
                unauthorized access to your account.
              </li>
              <li>
                Promptly notify us if you discover or suspect any security
                breaches related to the Services or your account.
              </li>
            </ul>
            <p>
              You must be at least [**Specify Age, e.g., 18 years old**] or the
              age of legal majority in your jurisdiction to create an account.
            </p>
          </motion.section>

          {/* Section 3: Acceptable Use */}
          <motion.section
            id="acceptable-use"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>3. Acceptable Use Policy</h2>
            <p>
              You agree not to use the Services for any unlawful purpose or in
              any way that interrupts, damages, or impairs the service.
              Prohibited activities include, but are not limited to:
            </p>
            <ul>
              <li>
                Uploading or processing content that is illegal, harmful,
                infringing, defamatory, obscene, or otherwise objectionable.
              </li>
              <li>
                Violating the intellectual property rights or privacy rights of
                others.
              </li>
              <li>
                Attempting to reverse engineer, decompile, or otherwise discover
                the source code of the Services.
              </li>
              <li>
                Using automated means (bots, scrapers) to access the Services
                without permission.
              </li>
              <li>
                Overloading or attempting to disrupt our servers or networks.
              </li>
              <li>
                Using the service to generate spam or unsolicited
                communications.
              </li>
              <li>Misrepresenting your identity or affiliation.</li>
            </ul>
          </motion.section>

          {/* Section 4: User Content */}
          <motion.section
            id="user-content"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>4. User Content</h2>
            <p>
              <strong>Your Ownership:</strong> You retain all ownership rights
              to the documents and other content you upload or input into the
              Services (&quot;User Content&quot;).
            </p>
            <p>
              <strong>License You Grant Us:</strong> By using the Services, you
              grant Versa AI a worldwide, non-exclusive, royalty-free,
              sublicensable license to use, host, store, reproduce, modify
              (e.g., to format for display), process, analyze, and display your
              User Content solely for the purpose of operating, providing,
              improving, and securing the Services for you. This license
              terminates when you delete your User Content or your account,
              subject to necessary retention for backups or legal obligations.
            </p>
            <p>
              <strong>AI Training:</strong> As stated in our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>, we do not use
              your User Content (documents, chats) to train our general AI
              models unless you explicitly opt-in to such a program, if offered.
              [**ENSURE CONSISTENCY WITH PRIVACY POLICY**]
            </p>
            <p>
              <strong>Your Responsibility:</strong> You are solely responsible
              for your User Content and ensuring you have all necessary rights
              and permissions to upload and process it through the Services. You
              represent and warrant that your User Content does not violate
              these Terms or any applicable laws.
            </p>
          </motion.section>

          {/* Section 5: Intellectual Property */}
          <motion.section
            id="intellectual-property"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>5. Intellectual Property Rights</h2>
            <p>
              Excluding your User Content, the Services and all materials
              therein or transferred thereby, including, without limitation,
              software, images, text, graphics, logos, patents, trademarks,
              service marks, copyrights, photographs, audio, videos, music
              (&quot;Company Content&quot;), and all Intellectual Property
              Rights related thereto, are the exclusive property of Versa AI and
              its licensors. Use of the Services does not grant you any
              ownership rights in the Company Content.
            </p>
          </motion.section>

          {/* Section 6: Subscription and Payment */}
          <motion.section
            id="subscriptions"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>6. Subscription Plans and Payment</h2>
            <p>
              Certain features of the Services may require payment of fees based
              on subscription plans (&quot;Plans&quot;). Current Plan details
              and pricing are available on our{" "}
              <Link href="/pricing">Pricing Page</Link>.
            </p>
            <ul>
              <li>
                <strong>Billing:</strong> You agree to pay all applicable fees
                for your chosen Plan. Fees are typically billed in advance on a
                recurring basis (e.g., monthly or annually).
              </li>
              <li>
                <strong>Payment Processor:</strong> We use a third-party payment
                processor ([**Specify Payment Processor, e.g., Stripe**]) to
                handle payments. Your payment information is subject to their
                terms and privacy policy.
              </li>
              <li>
                <strong>Renewals:</strong> Subscriptions automatically renew
                unless cancelled prior to the end of the current billing cycle.
              </li>
              <li>
                <strong>Cancellations & Refunds:</strong> You may cancel your
                subscription at any time through your account settings or by
                contacting support. [**Clearly state your refund policy - e.g.,
                &quot;Fees are generally non-refundable except where required by
                law.&quot; or link to a specific refund policy.**]
              </li>
              <li>
                <strong>Price Changes:</strong> We reserve the right to change
                Plan fees upon reasonable prior notice (e.g., 30 days) posted on
                our Website or sent via email.
              </li>
            </ul>
          </motion.section>

          {/* Section 7: Termination */}
          <motion.section
            id="termination"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your access to the Services
              immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach these
              Terms.
            </p>
            <p>
              You may terminate your account at any time by [**Describe process,
              e.g., using the account settings page or contacting support**].
            </p>
            <p>
              Upon termination, your right to use the Services will cease
              immediately. Provisions of these Terms which by their nature
              should survive termination shall survive (e.g., ownership
              provisions, warranty disclaimers, indemnity, limitations of
              liability).
            </p>
            <p>
              [**Specify data deletion policy upon termination/account closure,
              consistent with Privacy Policy and Retention section.**]
            </p>
          </motion.section>

          {/* Section 8: Disclaimers */}
          <motion.section
            id="disclaimers"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>8. Disclaimers of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; BASIS. USE OF THE SERVICES IS AT YOUR OWN RISK. TO
              THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE
              PROVIDED WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
              IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT. NO ADVICE OR INFORMATION, WHETHER ORAL OR
              WRITTEN, OBTAINED BY YOU FROM VERSA AI OR THROUGH THE SERVICES
              WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED HEREIN.
            </p>
            <p>
              WITHOUT LIMITING THE FOREGOING, VERSA AI, ITS SUBSIDIARIES, ITS
              AFFILIATES, AND ITS LICENSORS DO NOT WARRANT THAT THE CONTENT
              (INCLUDING AI-GENERATED RESPONSES) IS ACCURATE, RELIABLE OR
              CORRECT; THAT THE SERVICES WILL MEET YOUR REQUIREMENTS; THAT THE
              SERVICES WILL BE AVAILABLE AT ANY PARTICULAR TIME OR LOCATION,
              UNINTERRUPTED OR SECURE; THAT ANY DEFECTS OR ERRORS WILL BE
              CORRECTED; OR THAT THE SERVICES ARE FREE OF VIRUSES OR OTHER
              HARMFUL COMPONENTS.
            </p>
          </motion.section>

          {/* Section 9: Limitation of Liability */}
          <motion.section
            id="limitation-liability"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>9. Limitation of Liability</h2>
            <p>
              [**LEGAL REVIEW REQUIRED**] TO THE MAXIMUM EXTENT PERMITTED BY
              APPLICABLE LAW, IN NO EVENT SHALL VERSA AI, ITS AFFILIATES,
              AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS OR LICENSORS BE LIABLE FOR
              ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR
              EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS
              OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES,
              ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE
              SERVICES.
            </p>
            <p>
              [**LEGAL REVIEW REQUIRED**] TO THE MAXIMUM EXTENT PERMITTED BY
              APPLICABLE LAW, VERSA AI ASSUMES NO LIABILITY OR RESPONSIBILITY
              FOR ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT; (II)
              PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER,
              RESULTING FROM YOUR ACCESS TO OR USE OF OUR SERVICES; (III) ANY
              UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND
              ALL PERSONAL INFORMATION STORED THEREIN; (IV) ANY INTERRUPTION OR
              CESSATION OF TRANSMISSION TO OR FROM THE SERVICES; (V) ANY BUGS,
              VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR
              THROUGH OUR SERVICES BY ANY THIRD PARTY; (VI) ANY ERRORS OR
              OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE INCURRED AS A
              RESULT OF THE USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR
              OTHERWISE MADE AVAILABLE THROUGH THE SERVICES; AND/OR (VII) USER
              CONTENT OR THE DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY
              THIRD PARTY.
            </p>
            <p>
              [**LEGAL REVIEW REQUIRED - Liability Cap**] IN NO EVENT SHALL
              VERSA AI, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS,
              OR LICENSORS BE LIABLE TO YOU FOR ANY CLAIMS, PROCEEDINGS,
              LIABILITIES, OBLIGATIONS, DAMAGES, LOSSES OR COSTS IN AN AMOUNT
              EXCEEDING THE AMOUNT YOU PAID TO VERSA AI HEREUNDER IN THE
              [**Specify Period, e.g., SIX or TWELVE**] MONTHS PRECEDING THE
              EVENT GIVING RISE TO THE CLAIM OR [**Specify Amount, e.g., $100
              USD**], WHICHEVER IS GREATER.
            </p>
            <p>
              SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
              CERTAIN DAMAGES, SO THE ABOVE LIMITATIONS AND EXCLUSIONS MAY NOT
              APPLY TO YOU.
            </p>
          </motion.section>

          {/* Section 10: Indemnification */}
          <motion.section
            id="indemnification"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>10. Indemnification</h2>
            <p>
              You agree to defend, indemnify and hold harmless Versa AI and its
              subsidiaries, agents, licensors, managers, and other affiliated
              companies, and their employees, contractors, agents, officers and
              directors, from and against any and all claims, damages,
              obligations, losses, liabilities, costs or debt, and expenses
              (including but not limited to attorney&apos;s fees) arising from:
              (i) your use of and access to the Services, including any data or
              content transmitted or received by you; (ii) your violation of any
              term of these Terms; (iii) your violation of any third-party
              right, including without limitation any right of privacy or
              Intellectual Property Rights; (iv) your violation of any
              applicable law, rule or regulation; (v) User Content or any
              content that is submitted via your account including without
              limitation misleading, false, or inaccurate information; or (vi)
              your willful misconduct.
            </p>
          </motion.section>

          {/* Section 11: Governing Law & Dispute Resolution */}
          <motion.section
            id="governing-law"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>11. Governing Law and Dispute Resolution</h2>
            <p>
              [**LEGAL REVIEW REQUIRED**] These Terms shall be governed by the
              laws of the State of California, United States, without regard to
              its conflict of law principles.
            </p>
            <p>
              [**LEGAL REVIEW REQUIRED - Specify Dispute Resolution Process:**
              e.g., Mandatory arbitration? Specific court venue like Santa Ana,
              CA? Class action waiver? Consult lawyer based on business
              structure and user base.] Example: &quot;Any dispute arising from
              or relating to the subject matter of these Terms shall be finally
              settled by arbitration in [Specify City, e.g., Santa Ana],
              California, using the English language in accordance with the
              Arbitration Rules and Procedures of [Specify Arbitration Body,
              e.g., JAMS] then in effect...&quot; OR &quot;You agree that any
              legal action or proceeding relating to these Terms shall be
              brought exclusively in the federal or state courts located in
              Orange County, California.&quot;
            </p>
          </motion.section>

          {/* Section 12: Changes to Terms */}
          <motion.section
            id="changes-terms"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>12. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least [**Specify Notice Period, e.g., 15 or 30**]
              days&apos; notice prior to any new terms taking effect, typically
              by posting a notice on our Website or sending an email to the
              address associated with your account. What constitutes a material
              change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Services after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use the Services.
            </p>
          </motion.section>

          {/* Section 13: Miscellaneous */}
          <motion.section
            id="misc"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>13. Miscellaneous</h2>
            <p>
              <strong>Entire Agreement:</strong> These Terms constitute the
              entire agreement between you and Versa AI regarding the Services
              and supersede all prior agreements or understandings.
            </p>
            <p>
              <strong>Severability:</strong> If any provision of these Terms is
              held to be invalid or unenforceable, that provision will be
              limited or eliminated to the minimum extent necessary, and the
              remaining provisions will remain in full force and effect.
            </p>
            <p>
              <strong>No Waiver:</strong> No waiver of any term of these Terms
              shall be deemed a further or continuing waiver of such term or any
              other term, and Versa AI&apos;s failure to assert any right or
              provision under these Terms shall not constitute a waiver of such
              right or provision.
            </p>
            {/* Add Assignment clause if needed */}
          </motion.section>

          {/* Section 14: Contact Information */}
          <motion.section
            id="contact-us"
            className="mt-10 pt-6 border-t border-gray-200"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="mt-3 not-italic text-sm leading-relaxed">
              Versa AI <br />
              <a
                href="mailto:hello@versai.com"
                className="text-blue-600 hover:underline"
              >
                hello@versai.com
              </a>{" "}
              <br />
              123 AI Street, Suite 404 <br />
              Tech City, California, 90210 <br />
              United States
            </address>
          </motion.section>
        </div>{" "}
        {/* End Prose container */}
      </div>
    </div>
  );
};

export default TermsOfServicePage;
