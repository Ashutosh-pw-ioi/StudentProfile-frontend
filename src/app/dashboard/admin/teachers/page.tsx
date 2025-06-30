"use client";

import React from "react";
import { Users } from "lucide-react";
import UploadSection from "../UploadSection";

export default function AdminProfile() {
  return (
    <div className="space-y-6">
      <div className="w-full flex justify-between">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Teachers Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#1B3A6A]" />
            </div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              Total Students
            </h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">15</p>
          </div>
        </div>
        <UploadSection />
      </div>
    </div>
  );
}
