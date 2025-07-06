"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import UploadSection from "./UploadSection";
import Table from "./Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "./Shimmer";

// Helper function to convert semester number to string
function getSemesterString(semesterNo: number): string {
  if (semesterNo === 1) return "1st";
  if (semesterNo === 2) return "2nd";
  if (semesterNo === 3) return "3rd";
  return `${semesterNo}th`;
}

function getSemesterNumber(semesterStr: string): number {
  return parseInt(semesterStr);
}

export default function AdminProfile() {

  const router = useRouter();


  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "SUPER_ADMIN") {
          router.push("/dashboard/superadmin");
        }
      } catch (e) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, [router]);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [studentsFull, setStudentsFull] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStudentData = useCallback(async () => {


    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/admin/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/api/student/get-center-students",
        {
          headers: {
            token: token,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        // Store full student data for edit operations
        setStudentsFull(data.students);

        // Transform the data to match table structure
        let transformedData = data.students.map((student: any) => ({
          id: student.id,
          name: student.name,
          studentId: student.enrollmentNumber,
          email: student.email,
          batch: student.batch.name,
          semester: getSemesterString(student.semesterNo),
          department: student.department.name,
          cgpa: "NA",
          centerName: student.center.name,
        }));

        // Sort by studentId (enrollmentNumber) in ascending order
        transformedData = transformedData.sort((a, b) =>
          a.studentId.localeCompare(b.studentId)
        );

        setStudentsData(transformedData);
      } else {
        throw new Error(data.message || "Failed to fetch student data");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData, refreshTrigger]);

  // Add this function to trigger a refresh
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditStudent = async (updatedItem: any) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/admin/login");
      return;
    }
    

    try {
      // Find the original student data
      const originalStudent = studentsFull.find((s) => s.id === updatedItem.id);
      if (!originalStudent) {
        throw new Error("Student not found");
      }

      // Prepare edit payload
      const editPayload = {
        id: updatedItem.id,
        centerName: originalStudent.center.name,
        depName: originalStudent.department.name,
        batchName: originalStudent.batch.name,
        name: updatedItem.name,
        gender: "Male", // Default value since not in UI
        phoneNumber: "0000000000", // Default value since not in UI
        semesterNo: getSemesterNumber(updatedItem.semester),
        password: "password", // Default value since not in UI
      };

      const response = await axios.put(
        "http://localhost:8000/api/student/edit-student",
        editPayload,
        {
          headers: {
            token: token,
          },
        }
      );

      const result = response.data;
      if (result.success) {
        // Refetch data to get updated list
        setRefreshTrigger((prev) => prev + 1);
      } else {
        throw new Error(result.message || "Failed to update student");
      }
    } catch (err: any) {
      setError(err.message || "Error updating student");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/admin/login");
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:8000/api/student/delete-student",
        {
          headers: {
            token: token,
          },
          data: { id },
        }
      );

      const result = response.data;
      if (result.success) {
        // Refetch data to get updated list
        setRefreshTrigger((prev) => prev + 1);
      } else {
        throw new Error(result.message || "Failed to delete student");
      }
    } catch (err: any) {
      setError(err.message || "Error deleting student");
    }
  };

  if (loading) {
    return <Shimmer />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Student schema configuration
  const studentSchemaInfo = {
    title: "Student Upload",
    columns: [
      "name",
      "email",
      "password",
      "gender",
      "phoneNumber",
      "enrollmentNumber",
      "center",
      "department",
      "batch",
    ],
    sampleRow: [
      "John Doe",
      "john@example.com",
      "password123",
      "Male",
      "1234567890",
      "ENR2024001",
      "Patna",
      "SOT",
      "SOT24B1",
    ],
    columnDescriptions: [
      { key: "name", description: "Full name of the student" },
      { key: "email", description: "Email address of the student" },
      { key: "password", description: "Password for student account" },
      { key: "gender", description: "Gender (Male, Female, Other)" },
      { key: "phoneNumber", description: "Phone number (10 digits)" },
      {
        key: "enrollmentNumber",
        description: "Unique enrollment number",
      },
      { key: "center", description: "Center name (e.g., Patna)" },
      { key: "department", description: "Department (SOT, SOM, SOH)" },
      { key: "batch", description: "Batch name (e.g., SOT24B1)" },
    ],
    guidelines: [
      "Column headers must match exactly",
      "All fields are required",
      "Department should be one of: SOT, SOM, SOH",
      "Center name must match existing centers",
      "Batch names must match existing batches",
    ],
    commonIssues: [
      "Wrong column names",
      "Missing required fields",
      "Incorrect department or center names",
      "Duplicate enrollment numbers",
      "Invalid email formats",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Students Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Students</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {studentsData.length}
            </p>
          </div>
        </div>
        <UploadSection 
          onSuccess={triggerRefresh}
          uploadUrl="http://localhost:8000/api/student/add-student"
          schemaInfo={studentSchemaInfo}
        />
      </div>

      <Table
        data={studentsData}
        title="Students Overview"
        filterField="department"
        badgeFields={["department"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
          semester: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
        }}
        nonEditableFields={["id", "studentId", "email", "cgpa", "centerName"]}
        hiddenColumns={["id", "centerName"]}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}