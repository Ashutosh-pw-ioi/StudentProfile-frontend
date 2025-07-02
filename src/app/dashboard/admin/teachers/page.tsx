"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import UploadSection from "../UploadSection";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teachersFull, setTeachersFull] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login/admin");
    }
  }, [router]);

  // Fetch teachers data
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/teacher/center-teachers",
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/admin");
        return;
      }

      const data = response.data;
      setTeachersFull(data.teachers);

      const transformedData = data.teachers.map((teacher: any) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department.name,
        batches: teacher.batches.map((batch: any) => batch.name).join(", "),
        center: teacher.center.name,
      }));

      setTeachers(transformedData);
    } catch (error: any) {
      console.error("Error fetching teachers:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load teachers"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers, refreshTrigger]);

  // Update teacher handler
  const handleUpdateTeacher = async (updatedItem: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      // Find the original teacher data
      const originalTeacher = teachersFull.find((t) => t.id === updatedItem.id);
      if (!originalTeacher) {
        throw new Error("Teacher not found");
      }

      const centerName = originalTeacher.center?.name;
      if (!centerName) {
        throw new Error("Center information not found for teacher");
      }

      // Prepare update payload
      const updateData = {
        id: updatedItem.id,
        name: updatedItem.name,
        email: updatedItem.email,
        gender: originalTeacher.gender || "Male",
        phoneNumber: originalTeacher.phoneNumber || "0000000000",
        experience: originalTeacher.experience || 0,
        centerName: centerName,
        depName: updatedItem.department,
      };

      await axios.put(
        "http://localhost:8000/api/teacher/update-teacher",
        updateData,
        {
          headers: {
            token: token,
          },
        }
      );

      // Refresh data after update
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/admin");
        return;
      }
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update teacher"
      );
    }
  };

  // Delete teacher handler
  const handleDeleteTeacher = async (id: string | number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      await axios.delete(
        "http://localhost:8000/api/teacher/delete-teacher",
        {
          headers: {
            token: token,
          },
          data: { id },
        }
      );

      // Refresh data after delete
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/admin");
        return;
      }
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete teacher"
      );
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return <Shimmer />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
            setRefreshTrigger((prev) => prev + 1);
          }}
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Teacher schema configuration
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
      "courseName"
    ],
    sampleRow: [
      "Jane Smith",
      "jane@example.com",
      "securePassword",
      "Female",
      "0987654321",
      "5",
      "Patna",
      "SOT",
      "SOT24B1",
      "Mathematics"
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
      { key: "courseName", description: "Course name (e.g., Mathematics)" }
    ],
    guidelines: [
      "Column headers must match exactly",
      "All fields are required",
      "Department should be one of: SOT, SOM, SOH",
      "Center name must match existing centers",
      "Batch names must match existing batches",
      "Course names must match existing courses in the specified batch"
    ],
    commonIssues: [
      "Wrong column names",
      "Missing required fields",
      "Incorrect department, center, or course names",
      "Duplicate email addresses",
      "Invalid experience values (should be a number)",
      "Course not found in the specified batch"
    ],
  };

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
    </div>
  );
}