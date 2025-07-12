"use client";

import React from "react";

const ProfileSkeleton = () => (
  <div className="space-y-4 relative px-2">
    {/* Header skeleton - smaller on mobile */}
    <div className="h-8 sm:h-10 bg-gray-200 rounded w-2/3 sm:w-1/3 mb-6 sm:mb-8 animate-pulse"></div>

    {/* Profile card - responsive layout */}
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
        <div className="space-y-2 sm:space-y-3 text-center sm:text-left w-full">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 sm:w-48 mx-auto sm:mx-0 animate-pulse"></div>
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 sm:w-32 mx-auto sm:mx-0 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Stats cards - single column on mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-4 sm:py-6 px-4"
        >
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3 sm:mb-4 animate-pulse"></div>
          <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/3 sm:w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>

    {/* Details section - better mobile spacing */}
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-4 sm:p-6">
      <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-4 sm:mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 sm:last:border-b"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3 sm:w-1/4 animate-pulse"></div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-2/5 sm:w-1/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom stats - single column on mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-4 sm:py-6 px-4"
        >
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3 sm:mb-4 animate-pulse"></div>
          <div className="h-12 sm:h-16 bg-gray-200 rounded w-1/3 sm:w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
