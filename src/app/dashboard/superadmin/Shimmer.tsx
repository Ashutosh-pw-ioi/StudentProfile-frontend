// components/Shimmer.tsx
import React from "react";
import clsx from "clsx";

const ShimmerCard = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      "animate-pulse bg-gray-200 rounded-lg h-48 w-full",
      className
    )}
  ></div>
);

const ShimmerTableRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

export default function Shimmer() {
  return (
    <div className="space-y-6">
      {/* Shimmer for heading */}
      <div>
        <div className="h-8 w-72 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Shimmer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShimmerCard />
        <ShimmerCard />
      </div>

      {/* Responsive shimmer table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {[...Array(6)].map((_, i) => (
                <th
                  key={i}
                  className="py-3 px-4 bg-gray-100 text-left whitespace-nowrap"
                ></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <ShimmerTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
