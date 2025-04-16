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

const CookiePolicyPage = () => {
  // Set date manually or fetch from CMS. Should match or be later than the effective date.
  // Current time is Monday, April 14, 2025 at 1:13:18 PM PDT. Location: Santa Ana, California, United States. (Context prompt info)
  const lastUpdatedDate = "April 14, 2025"; // <-- **MANUALLY UPDATE THIS DATE WHEN POLICY CHANGES**

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
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: {lastUpdatedDate}
          </p>
        </motion.div>
        {/* Use prose class for default styling of generated HTML */}
        <div className="prose prose-slate max-w-none prose-sm md:prose-base prose-headings:font-semibold prose-headings:text-gray-800 prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:underline prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-ol:list-decimal prose-ol:pl-6">
          {/* Section 1: Introduction */}
          <motion.section
            id="introduction"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2>1. Introduction</h2>
            <p>
              This Cookie Policy explains how Versa AI (&quot;Company&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies
              and similar tracking technologies when you visit our website{" "}
              <a
                href="https://versa-ai.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://versa-ai.co
              </a>{" "}
              or use our Versa AI Platform (collectively, the
              &quot;Services&quot;). It explains what these technologies are and
              why we use them, as well as your rights to control our use of
              them.
            </p>
            <p>
              This Cookie Policy should be read together with our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>, which provides
              additional details about how we use personal information.
            </p>
            {/* --- LEGAL DISCLAIMER --- */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-800 not-prose">
              <strong className="font-bold">Legal Disclaimer:</strong> This
              website is currently a demonstration and is not live nor does it
              process any payments. We only store a JSON Web Token (JWT) in a
              cookie for authentication purposes. No other data is extracted or
              stored via cookies. Please note that cookie and data protection
              laws (including the ePrivacy Directive, GDPR, and CCPA) are
              complex and subject to change. Versa AI intends to consult with
              qualified legal counsel prior to launching any live service to
              ensure full compliance with applicable regulations.
            </div>

            {/* --- END DISCLAIMER --- */}
          </motion.section>

          {/* Section 2: What Are Cookies? */}
          <motion.section
            id="what-are-cookies"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>
            <p>
              Cookies set by the website owner (in this case, Versa AI) are
              called &quot;first-party cookies&quot;. Cookies set by parties
              other than the website owner are called &quot;third-party
              cookies&quot;. Third-party cookies enable third-party features or
              functionality to be provided on or through the website (e.g., like
              analytics, advertising, interactive content).
            </p>
            <p>
              Cookies can remain on your device for different periods.
              &quot;Session cookies&quot; exist only while your browser is open
              and are deleted automatically once you close your browser.
              &quot;Persistent cookies&quot; survive after your browser is
              closed and can be used by the website to recognize your computer
              when you open your browser and browse the Internet again.
            </p>
          </motion.section>

          {/* Section 3: How We Use Cookies */}
          <motion.section
            id="how-we-use"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>3. How We Use Cookies</h2>
            <p>
              We use first-party and potentially third-party cookies for several
              reasons. Some cookies are required for technical reasons in order
              for our Services to operate, and we refer to these as
              &quot;essential&quot; or &quot;strictly necessary&quot; cookies.
              Other cookies enable us to track and target the interests of our
              users to enhance the experience on our Services. Third parties may
              serve cookies through our Services for analytics and other
              purposes.
            </p>
            <p>
              The specific types of first-party and third-party cookies served
              through our Services and the purposes they perform are described
              below:
            </p>
            <ul>
              <li>
                <strong>Strictly Necessary Cookies:</strong> These cookies are
                essential to provide you with services available through our
                Website and Platform and to use some of its features, such as
                access to secure areas (e.g., authentication, session
                management). Because these cookies are strictly necessary to
                deliver the Services, you cannot refuse them without impacting
                how our Services function. [**List examples if possible, e.g.,
                session ID cookie name**]
              </li>
              <li>
                <strong>Performance and Analytics Cookies:</strong> These
                cookies collect information that is used either in aggregate
                form to help us understand how our Services are being used or
                how effective our marketing campaigns are, or to help us
                customize our Services for you. They help us improve website
                performance and user experience. Examples include cookies from
                [**Specify Analytics Providers, e.g., Google Analytics, Vercel
                Analytics, Plausible Analytics**].
              </li>
              <li>
                <strong>Functionality Cookies:</strong> These cookies are used
                to recognize you when you return to our Services. They enable us
                to personalize our content for you, greet you by name, and
                remember your preferences (for example, your choice of language
                or region), enhancing your user experience. [**List examples if
                applicable, e.g., theme preference cookie**]
              </li>
              <li>
                <strong>Targeting/Advertising Cookies:</strong> [**Modify or
                remove if not applicable**] These cookies are used to make
                advertising messages more relevant to you. They perform
                functions like preventing the same ad from continuously
                reappearing, ensuring that ads are properly displayed, and in
                some cases selecting advertisements based on your interests. We
                [**&quot;do not currently use&quot; OR specify if you do**]
                these types of cookies directly on our main Services.
                Third-party services linked from our site may use them according
                to their own policies.
              </li>
            </ul>
            <p>
              [**Consider adding a table listing specific cookies, their
              purpose, provider (first/third party), and duration
              (session/persistent/expiry date) if required by regulations or
              desired for transparency. This often requires a cookie audit.**]
            </p>
          </motion.section>

          {/* Section 4: Your Choices Regarding Cookies */}
          <motion.section
            id="your-choices"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>4. Your Choices Regarding Cookies</h2>
            <p>
              You have the right to decide whether to accept or reject cookies
              (other than strictly necessary ones).
            </p>
            <ul>
              <li>
                <strong>Cookie Consent Tool:</strong> When you first visit our
                Website, you [**should - implement this!**] be presented with a
                cookie banner or management tool where you can exercise your
                cookie preferences. You can typically adjust these preferences
                at any time via [**Specify location, e.g., a &quot;Cookie
                Settings&quot; link in the footer**].
              </li>
              <li>
                <strong>Browser Settings:</strong> Most web browsers allow
                control over cookies through their settings. You can set your
                browser to refuse cookies or to alert you when cookies are being
                sent. However, if you select this setting you may be unable to
                access certain parts of our Services. Find out more about
                managing cookies on popular browsers: [**Link to browser guides:
                Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, etc.**]
              </li>
              <li>
                <strong>Third-Party Opt-Outs:</strong> For third-party analytics
                cookies like Google Analytics, you may be able to opt-out
                directly via their provided tools (e.g., Google Analytics
                Opt-out Browser Add-on). [**Provide links if applicable.**]
              </li>
            </ul>
            <p>
              Please note that blocking or deleting cookies may negatively
              impact your experience using the Services.
            </p>
          </motion.section>

          {/* Section 5: Changes to This Cookie Policy */}
          <motion.section
            id="changes-policy"
            className="mb-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>5. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time in order to
              reflect, for example, changes to the cookies we use or for other
              operational, legal, or regulatory reasons. Please therefore
              re-visit this Cookie Policy regularly to stay informed about our
              use of cookies and related technologies.
            </p>
            <p>
              The date at the top of this Cookie Policy indicates when it was
              last updated.
            </p>
          </motion.section>

          {/* Section 6: Contact Us */}
          <motion.section
            id="contact-us"
            className="mt-10 pt-6 border-t border-gray-200"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or other
              technologies, please email us at{" "}
              <a href="mailto:hello@versai.com">hello@versai.com</a> or refer to
              the contact details in our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </motion.section>
        </div>{" "}
        {/* End Prose container */}
      </div>
    </div>
  );
};

export default CookiePolicyPage;
