"use client";

import React from "react";

export default function StudentProfileSkeleton() {
  const shimmerBox = "bg-gray-200 rounded animate-shimmer";

  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-shimmer" />

      <div className="bg-white/80 p-8 rounded-lg shadow">
        <div className="flex items-center space-x-6">
          <div className={`w-24 h-24 ${shimmerBox} rounded-full`} />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-gray-200 rounded animate-shimmer" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-shimmer" />
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/80 p-6 rounded-lg shadow">
            <div className="h-4 w-24 bg-gray-200 mx-auto mb-4 rounded animate-shimmer" />
            <div className="h-6 w-16 bg-gray-300 mx-auto rounded animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="bg-white/80 p-6 rounded-lg shadow">
        <div className="h-6 w-48 bg-gray-300 mb-6 rounded animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, col) => (
            <div key={col} className="space-y-4">
              {[...Array(4)].map((_, row) => (
                <div
                  key={row}
                  className="flex justify-between border-b py-2 border-gray-100"
                >
                  <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-shimmer" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
