"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const centers = [
  { id: "1", name: "Patna" },
  { id: "2", name: "Bangalore" },
  { id: "3", name: "Noida" },
  { id: "4", name: "Indore" },
  { id: "5", name: "Lucknow" },
  { id: "6", name: "Pune" },
];

const SuperAdminProfile = () => {
  const [selectedCenter, setSelectedCenter] = useState<string | null>(
    "Bangalore"
  );

  useEffect(() => {
    const storedCenter = localStorage.getItem("selectedCenter");
    if (storedCenter) {
      setSelectedCenter(storedCenter);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCenter(value);
    localStorage.setItem("selectedCenter", value);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="bg-[#1B3A6A] flex flex-col items-center justify-center w-lg h-[500px] text-white p-10 shadow-2xl rounded-lg gap-10 px-20">
        <Image src="/PWIOILogo.webp" alt="PW IOI Logo" width={250} height={0} />

        <div className="relative w-full text-white">
          <select
            value={selectedCenter || ""}
            onChange={handleChange}
            className="w-full border-2 border-white py-4 rounded-lg px-6 appearance-none bg-[#D9A864] focus:ring-white font-bold text-lg"
          >
            <option value="" disabled>
              Select Center
            </option>
            {centers.map((center) => (
              <option key={center.id} value={center.name}>
                {center.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>

        {selectedCenter && (
          <p style={{ marginTop: "10px" }}>
            Selected Center: <strong>{selectedCenter}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default SuperAdminProfile;
