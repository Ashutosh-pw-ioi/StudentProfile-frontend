"use client";

import React, { useState, useEffect } from "react";

// Static list of centers
const centers = [
  { id: "1", name: "Patna" },
  { id: "2", name: "Bangalore" },
  { id: "3", name: "Noida" },
  { id: "4", name: "Indore" },
  { id: "5", name: "Lucknow" }, 
  { id: "6", name: "Pune" },
];

const SuperAdminProfile = () => {
  const [selectedCenter, setSelectedCenter] = useState<string | null>("Bangalore");

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
    <div>
      <select value={selectedCenter || ""} onChange={handleChange}>
        <option value="" disabled>Select Center</option>
        {centers.map((center) => (
          <option key={center.id} value={center.name}>
            {center.name}
          </option>
        ))}
      </select>

      {selectedCenter && (
        <p style={{ marginTop: "10px" }}>
          Selected Center: <strong>{selectedCenter}</strong>
        </p>
      )}
    </div>
  );
};

export default SuperAdminProfile;
