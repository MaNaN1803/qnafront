import React from "react";

const Preloader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated dots */}
        <div className="flex space-x-2">
          <div className="h-4 w-4 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-4 w-4 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          <div className="h-4 w-4 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></div>
        </div>

        {/* Loading text with animation */}
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-widest">
          Loading
          <span className="animate-pulse">...</span>
        </p>
      </div>
    </div>
  );
};

export default Preloader;
