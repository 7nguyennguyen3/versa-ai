"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndPrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-6 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms & Privacy</h1>
      <p className="max-w-3xl text-gray-600 mb-8">
        Please review our Terms of Service and Privacy Policy to understand your
        rights and responsibilities when using our platform.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        {/* Terms of Service */}
        <Card className="shadow-lg border border-gray-300">
          <CardHeader>
            <CardTitle>📜 Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="text-left text-gray-600 space-y-4">
            <p>
              By using our AI-powered services, you agree to abide by our terms,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>✅ You must be at least 13 years old to use our platform.</li>
              <li>
                ✅ Do not upload illegal, harmful, or copyrighted materials.
              </li>
              <li>
                ✅ We do not guarantee AI-generated outputs to be 100% accurate.
              </li>
              <li>
                ✅ We reserve the right to modify or terminate services at any
                time.
              </li>
            </ul>
            <p>
              Failure to comply may result in restricted access or account
              termination.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="shadow-lg border border-gray-300">
          <CardHeader>
            <CardTitle>🔒 Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-left text-gray-600 space-y-4">
            <p>
              We value your privacy and handle data responsibly. Here’s how we
              manage your information:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                🔹 **Data Collection:** We collect minimal personal data (e.g.,
                email, uploaded files).
              </li>
              <li>
                🔹 **Usage Tracking:** We may track app usage to improve
                services, using Firebase Analytics.
              </li>
              <li>
                🔹 **Third-Party Services:** Our AI models may use external
                providers (e.g., OpenAI, Redis).
              </li>
              <li>
                🔹 **Data Retention:** Uploaded files are **not stored
                permanently** and are deleted after processing.
              </li>
              <li>
                🔹 **Your Rights:** You can request data deletion at any time by
                contacting support.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Contact & Compliance Notice */}
      <div className="mt-12 max-w-3xl text-gray-600">
        <p>
          For any concerns regarding your privacy or our terms, please contact
          us at
          <span className="text-blue-600 font-semibold">
            {" "}
            support@example.com
          </span>
          .
        </p>
        <p className="mt-4 text-sm">
          By continuing to use our platform, you acknowledge that you have read
          and agreed to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default TermsAndPrivacyPage;
