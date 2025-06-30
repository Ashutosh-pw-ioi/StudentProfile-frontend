"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import UploadSection from "../UploadSection";
import { teachersData } from "./teachersData";
import Table from "../Table";

export default function TeachersManagement() {
  const [studentsData, _] = useState(teachersData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Teachers Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Teachers</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {studentsData.length}
            </p>
          </div>
        </div>
        <UploadSection />
      </div>

      <Table
        data={teachersData}
        title="Teachers Overview"
        filterField="department"
        badgeFields={["department"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
        }}
        nonEditableFields={["id", "teacherId"]}
        hiddenColumns={["id"]}
      />
    </div>
  );
}
