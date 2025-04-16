"use client";

import CtaSection from "./_components/homepage/CtaSection";
import FeaturesSection from "./_components/homepage/FeaturesSection";
import HeroSection from "./_components/homepage/HeroSection";
import HowItWorksSection from "./_components/homepage/HowitWorksSection";
import TestimonialsSection from "./_components/homepage/TestimonialsSection";
import TrustSecuritySection from "./_components/homepage/TrustSecuritySection";
import UseCasesSection from "./_components/homepage/UseCasesSection";

const Homepage = () => {
  return (
    <main
      className="min-h-screen w-full 
    bg-gradient-to-br from-sky-50 via-white to-indigo-100
    flex flex-col items-center overflow-x-hidden"
    >
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <TestimonialsSection />
      <TrustSecuritySection />
      <CtaSection />
    </main>
  );
};

export default Homepage;
