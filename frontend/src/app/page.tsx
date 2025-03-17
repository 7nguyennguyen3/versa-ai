"use client";

import FeaturesSection from "./_components/homepage/FeaturesSection";
import HeroSection from "./_components/homepage/HeroSection";
import TestimonialsSection from "./_components/homepage/TestimonialsSection";
import UploadSection from "./_components/homepage/UploadSection";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center text-center px-6 py-12 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <UploadSection />
    </div>
  );
};

export default Homepage;
