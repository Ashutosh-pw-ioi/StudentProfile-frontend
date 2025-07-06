"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import UploadSection from "../UploadSection";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";

const centers = ["Patna", "Bangalore", "Noida", "Indore", "Lucknow", "Pune"];

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teachersFull, setTeachersFull] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");

  const router = useRouter();

  // Load center and role from localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const center = localStorage.getItem("selectedCenter");

    if (!token || !user) {
      router.push("/auth/login/admin");
      return;
    }

    const parsedUser = JSON.parse(user);
    setRole(parsedUser.role);

    if (center) setSelectedCenter(center);
  }, [router]);

  const fetchTeachers = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedCenter) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/teacher/center-teachers",
        { centerName: selectedCenter },
        { headers: { token } }
      );

      const data = response.data;
      if (!data.success) throw new Error(data.message || "Failed to load teachers");

      setTeachersFull(data.teachers);

      const transformed = data.teachers.map((t: any) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        department: t.department.name,
        batches: t.batches.map((b: any) => b.name).join(", "),
        center: t.center.name,
      }));

      setTeachers(transformed);
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedCenter) fetchTeachers();
  }, [fetchTeachers, refreshTrigger, selectedCenter]);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const center = e.target.value;
    setSelectedCenter(center);
    localStorage.setItem("selectedCenter", center);
  };

  const handleUpdateTeacher = async (updatedItem: any) => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedCenter) return;

    try {
      const original = teachersFull.find((t) => t.id === updatedItem.id);
      if (!original) throw new Error("Teacher not found");

      const payload = {
        id: updatedItem.id,
        name: updatedItem.name,
        email: updatedItem.email,
        gender: original.gender || "Male",
        phoneNumber: original.phoneNumber || "0000000000",
        experience: original.experience || 0,
        centerName: selectedCenter,
        depName: updatedItem.department,
      };

      await axios.put("http://localhost:8000/api/teacher/update-teacher", payload, {
        headers: { token },
      });

      triggerRefresh();
    } catch (err: any) {
      setError(err.message || "Error updating teacher");
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedCenter) return;

    try {
      await axios.delete("http://localhost:8000/api/teacher/delete-teacher", {
        headers: { token },
        data: { id, centerName: selectedCenter },
      });

      triggerRefresh();
    } catch (err: any) {
      setError(err.message || "Error deleting teacher");
    }
  };

  const teacherSchemaInfo = {
    title: "Teacher Upload",
    columns: [
      "name",
      "email",
      "password",
      "gender",
      "phoneNumber",
      "experience",
      "centerName",
      "departmentName",
      "batchName",
      "courseName",
    ],
    sampleRow: [
      "Jane Smith",
      "jane@example.com",
      "securePassword",
      "Female",
      "0987654321",
      "5",
      selectedCenter || "Patna",
      "SOT",
      "SOT24B1",
      "Mathematics",
    ],
    columnDescriptions: [
      { key: "name", description: "Full name of the teacher" },
      { key: "email", description: "Email address of the teacher" },
      { key: "password", description: "Password for teacher account" },
      { key: "gender", description: "Gender (Male, Female, Other)" },
      { key: "phoneNumber", description: "Phone number (10 digits)" },
      { key: "experience", description: "Years of teaching experience" },
      { key: "centerName", description: "Center name (e.g., Patna)" },
      { key: "departmentName", description: "Department (SOT, SOM, SOH)" },
      { key: "batchName", description: "Batch name (e.g., SOT24B1)" },
      { key: "courseName", description: "Course name (e.g., Mathematics)" },
    ],
    guidelines: [
      "Column headers must match exactly",
      "All fields are required",
      "Department should be one of: SOT, SOM, SOH",
      "Center name must match existing centers",
      "Batch names must match existing batches",
      "Course names must match existing courses in the specified batch",
    ],
    commonIssues: [
      "Wrong column names",
      "Missing required fields",
      "Incorrect department, center, or course names",
      "Duplicate email addresses",
      "Invalid experience values (should be a number)",
      "Course not found in the specified batch",
    ],
  };

  if (loading) return <Shimmer />;

  if (error)
    return (
      <div className="text-center mt-6 text-red-600">
        <p>{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg"
          onClick={() => {
            setError("");
            triggerRefresh();
          }}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Teachers Management
        </h2>
        {role === "superadmin" && (
          <select
            className="border border-gray-300 p-2 rounded"
            value={selectedCenter || ""}
            onChange={handleCenterChange}
          >
            <option value="">Select Center</option>
            {centers.map((center) => (
              <option key={center} value={center}>
                {center}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedCenter ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 shadow-lg rounded-lg">
              <div className="p-6 text-center">
                <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
                <h4 className="text-lg text-gray-600 mb-1">Total Teachers</h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {teachers.length}
                </p>
              </div>
            </div>

            <UploadSection
              onSuccess={triggerRefresh}
              uploadUrl="http://localhost:8000/api/teacher/add-teacher"
              schemaInfo={teacherSchemaInfo}
            />
          </div>

          <Table
            data={teachers}
            title="Teachers Overview"
            filterField="department"
            badgeFields={["department"]}
            selectFields={{
              department: ["SOT", "SOM", "SOH"],
            }}
            nonEditableFields={["id"]}
            hiddenColumns={["id", "center"]}
            onEdit={handleUpdateTeacher}
            onDelete={handleDeleteTeacher}
          />
        </>
      ) : (
        role === "superadmin" && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Please select a center</p>
          </div>
        )
      )}
    </div>
  );
}
