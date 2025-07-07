"use client";

import React from "react";

const ProfileSkeleton = () => (
  <div className="space-y-6 relative">
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>

    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-8">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-6"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>

    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-6"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
