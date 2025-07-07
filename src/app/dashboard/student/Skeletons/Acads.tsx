"use client";

import React from "react";

export default function AcademicsShimmer() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
          >
            <div className="text-center pb-2 pt-6">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="text-center pt-0 pb-6">
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
          >
            <div className="p-6">
              <div className="mb-2 flex items-start justify-between">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
        <div className="bg-gray-200 px-6 py-4">
          <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[1, 2, 3, 4].map((i) => (
                    <th key={i} className="text-left py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
        <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-20 h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[1, 2, 3, 4].map((i) => (
                    <th key={i} className="text-left py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
