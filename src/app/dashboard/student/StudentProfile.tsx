"use client";

import React, { useEffect, useState } from "react";
import { User, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StudentProfileSkeleton from "./Skeletons/Profile";
import attendanceData from "./constants/AttendanceData";
const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL

interface ApiResponse {
  success: boolean;
  data: StudentData;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  enrollmentNumber: string;
  semesterNo: number;
  center: {
    name: string;
  };
  department: {
    name: string;
  };
  batch: {
    name: string;
  };
  centerCity?: string;
  coursesOpted?: string[];
  admissionDate?: string;
  expectedGraduation?: string;
  cgpa?: number;
  attendance?: number;
  rollNo?: string;
}

export default function StudentProfile() {
  const [showAttendanceModal, setShowAttendanceModal] =
    useState<boolean>(false);
  const [tokenPresent, setTokenPresent] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setTokenPresent(!!token);
    if (!token) {
      router.push("/auth/login/student");
    }
  }, [router]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<ApiResponse>(
          `${backendUrl}/api/student/get-student-profile`,
          {
            headers: { token: token },
          }
        );

        if (response.data.success) {
          setStudentData(response.data.data);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/auth/login/student");
          } else {
            setError(
              err.response?.data?.message || "Failed to fetch student data"
            );
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (tokenPresent) {
      fetchStudentData();
    }
  }, [tokenPresent, router]);

  if (!tokenPresent) {
    return null;
  }

  if (loading) {
    return <StudentProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">No student data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Student Profile
        </h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {studentData.name}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm px-4 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full">
                    {studentData.batch.name}
                  </span>
                  <span className="text-sm px-4 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full">
                    {studentData.center.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Roll No.", "Department", "Ongoing semesterNo"].map((title, i) => (
          <div
            key={title}
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
          >
            <div className="text-center pb-2 pt-6">
              <h4 className="text-sm font-medium text-gray-600">{title}</h4>
            </div>
            <div className="text-center pt-0 pb-6">
              <p className="text-2xl font-bold text-gray-800">
                {
                  [
                    studentData.rollNo || studentData.enrollmentNumber,
                    studentData.department.name,
                    studentData.semesterNo,
                  ][i]
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              {[
                ["Gender", studentData.gender],
                ["Student ID", studentData.enrollmentNumber],
                [
                  "Center City",
                  studentData.centerCity || studentData.center.name,
                ],
                [
                  "Courses Opted",
                  studentData.coursesOpted
                    ? Array.isArray(studentData.coursesOpted)
                      ? studentData.coursesOpted.join(", ")
                      : studentData.coursesOpted
                    : "N/A",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-600 text-sm uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-gray-800 font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                ["Email", studentData.email],
                ["Phone Number", studentData.phoneNumber],
                ["Admission Date", studentData.admissionDate || "N/A"],
                [
                  "Expected Graduation",
                  studentData.expectedGraduation || "N/A",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-600 text-sm uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-gray-800 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-lg font-medium text-gray-600">CGPA</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {studentData.cgpa || "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 relative">
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="absolute top-4 right-4 text-[#1B3A6A]"
            aria-label="View Attendance Details"
          >
            <ArrowUpRight className="w-5 h-5 cursor-pointer" />
          </button>
          <div className="text-center pb-2 pt-6">
            <h4 className="text-lg font-medium text-gray-600">Attendance %</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {studentData.attendance || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Course-wise Attendance
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                onClick={() => setShowAttendanceModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {attendanceData.map(
                ({ course, percent, present, total, absent }) => (
                  <div
                    key={course}
                    className="bg-gray-50 rounded-xl p-6 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">{course}</h4>
                      <span
                        className={`text-2xl font-bold ${
                          percent >= 75 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {percent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Present: {present}</span>
                      <span>Total: {total}</span>
                      <span>Absent: {absent}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percent >= 75 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
