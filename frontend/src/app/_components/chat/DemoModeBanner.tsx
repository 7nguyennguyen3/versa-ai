import React from "react";

const DemoModeBanner: React.FC = () => {
  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-center text-xs sm:text-sm p-3 rounded-lg shadow-sm">
      This is a demo environment. Chats are not saved.{" "}
      <a
        href="/sign-up"
        className="font-semibold underline hover:text-yellow-900"
      >
        Sign up
      </a>{" "}
      for the full experience.
    </div>
  );
};

export default DemoModeBanner;
