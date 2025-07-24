"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, Users } from "lucide-react";
import UploadSection from "../UploadSection";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";
const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL

const centers = ["Patna", "Bangalore", "Noida", "Indore", "Lucknow", "Pune"];

function getSemesterString(semesterNo: number): string {
  if (semesterNo === 1) return "1st";
  if (semesterNo === 2) return "2nd";
  if (semesterNo === 3) return "3rd";
  return `${semesterNo}th`;
}

function getSemesterNumber(semesterStr: string): number {
  return parseInt(semesterStr);
}

export default function StudentManagement() {
  const router = useRouter();
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [studentsFull, setStudentsFull] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [role, setRole] = useState<string>("");

  // Load role and selected center on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/admin/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    setRole(parsedUser.role);

    const center = localStorage.getItem("selectedCenter");
    if (center) setSelectedCenter(center);
  }, [router]);

  const fetchStudentData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedCenter) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/student/get-center-students`,
        { centerName: selectedCenter },
        { headers: { token } }
      );

      const data = response.data;
      if (data.success) {
        setStudentsFull(data.students);

        const transformedData = data.students.map((student: any) => ({
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

        transformedData.sort((a: any, b: any) =>
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
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedCenter) fetchStudentData();
  }, [fetchStudentData, refreshTrigger, selectedCenter]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditStudent = async (updatedItem: any) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const originalStudent = studentsFull.find((s) => s.id === updatedItem.id);
      if (!originalStudent) throw new Error("Student not found");

      const editPayload = {
        id: updatedItem.id,
        centerName: selectedCenter,
        depName: originalStudent.department.name,
        batchName: originalStudent.batch.name,
        name: updatedItem.name,
        gender: "Male",
        phoneNumber: "0000000000",
        semesterNo: getSemesterNumber(updatedItem.semester),
        password: "password",
      };

      const response = await axios.put(
        `${backendUrl}/api/student/edit-student`,
        editPayload,
        { headers: { token } }
      );

      if (response.data.success) {
        triggerRefresh();
      } else {
        throw new Error(response.data.message || "Failed to update student");
      }
    } catch (err: any) {
      setError(err.message || "Error updating student");
    }
  };

  const handleDeleteStudent = async (id: string | number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/admin/login");
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/student/delete-student`,
        {
          headers: {
            token: token,
          },
          data: { id: String(id) },
        }
      );

      const result = response.data;
      if (result.success) {
        setRefreshTrigger((prev) => prev + 1);
      } else {
        throw new Error(result.message || "Failed to delete student");
      }
    } catch (err: any) {
      setError(err.message || "Error deleting student");
    }
  };

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const center = e.target.value;
    setSelectedCenter(center);
    localStorage.setItem("selectedCenter", center);
  };

  if (loading) return <Shimmer />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

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
      selectedCenter || "Bangalore",
      "SOT",
      "SOT24B1",
    ],
    columnDescriptions: [
      { key: "name", description: "Full name of the student" },
      { key: "email", description: "Email address of the student" },
      { key: "password", description: "Password for student account" },
      { key: "gender", description: "Gender (Male, Female, Other)" },
      { key: "phoneNumber", description: "Phone number (10 digits)" },
      { key: "enrollmentNumber", description: "Unique enrollment number" },
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
    downloadLink:
      "https://glqns72ea6.ufs.sh/f/35ZKzNsv5By61oPdNSQHWyStvbcNAs0uUq6hILf7wZlnmxj8",
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Students Management
        </h2>

        {role === "SUPER_ADMIN" && (
          <div className="flex sm:flex-row flex-col items-start sm:items-center space-x-3">
            <label
              htmlFor="center-select"
              className="text-gray-700 font-medium whitespace-nowrap"
            >
              Select Center:
            </label>
            <div className="relative max-w-[150px]">
              <select
                id="center-select"
                value={selectedCenter || ""}
                onChange={handleCenterChange}
                className="w-full appearance-none bg-[#1B3A6A] text-white border border-gray-300 rounded-md px-4 py-2 pr-10 cursor-pointer hover:bg-[#2a4a7a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="" disabled className="text-gray-400">
                  Choose a center...
                </option>
                {centers.map((center) => (
                  <option
                    key={center}
                    value={center}
                    className="bg-white text-gray-900"
                  >
                    {center}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-white" />
            </div>
          </div>
        )}
      </div>

      {selectedCenter && (
        <>
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
              uploadUrl={`${backendUrl}/api/student/add-student`}
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
              semester: [
                "1st",
                "2nd",
                "3rd",
                "4th",
                "5th",
                "6th",
                "7th",
                "8th",
              ],
            }}
            nonEditableFields={[
              "id",
              "studentId",
              "email",
              "cgpa",
              "centerName",
            ]}
            hiddenColumns={["id", "centerName"]}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </>
      )}

      {!selectedCenter && role === "superadmin" && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">
            Please select a center to view students
          </p>
        </div>
      )}
    </div>
  );
}
