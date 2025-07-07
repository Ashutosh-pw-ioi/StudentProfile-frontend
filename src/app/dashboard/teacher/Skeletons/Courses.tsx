"use client";
import React from "react";

const CoursesSkeleton = () => (
  <div className="max-w-6xl mx-auto">
    <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["BATCH", "SEMESTER", "COURSE", "ADMITTED STUDENTS"].map(
              (header) => (
                <th key={header} className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3].map((row) => (
            <tr key={row} className="hover:bg-gray-50">
              {[1, 2, 3, 4].map((cell) => (
                <td key={cell} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CoursesSkeleton;
