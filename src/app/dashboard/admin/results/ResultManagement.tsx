"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, Users } from "lucide-react";
import UploadSection from "../UploadSection";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";
import StudentScoresModal from "./StudentScoresModal";
const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL


const getAdminId = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  if (!user) return null;
  try {
    const userData = JSON.parse(user);
    return userData.id;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

interface Course {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  teachers: {
    id: string;
    name: string;
    email: string;
  }[];
  students: {
    studentId: string;
    studentName: string;
    email: string;
    enrollmentNumber: string;
    department: string;
    center: string;
    batch: string;
    scores: any;
  }[];
}

interface TableCourse {
  id: string;
  name: string;
  code: string;
  credits: number;
  teachers: string;
  students: number;
  department: string;
}

interface AdminData {
  id: string;
  center: {
    name: string;
  };
}

export default function ResultManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [centerName, setCenterName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkAuth = useCallback(() => {
    if (!mounted) return false;

    const token = getAuthToken();
    if (!token) {
      router.push("/auth/login/admin");
      return false;
    }
    return true;
  }, [mounted, router]);

  const fetchAdminCenter = useCallback(async () => {
    if (!mounted || !checkAuth()) return;

    const adminId = getAdminId();
    if (!adminId) {
      router.push("/auth/login/admin");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const response = await axios.post<{ data: AdminData }>(
        `${backendUrl}/api/admin/get`,
        { id: adminId },
        { headers: { token } }
      );

      if (response.data?.data?.center?.name) {
        setCenterName(response.data.data.center.name);
      }
    } catch (error) {
      console.error("Error fetching admin center:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (mounted) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/auth/login/admin");
        }
      }
    }
  }, [mounted, checkAuth, router]);

  useEffect(() => {
    if (mounted) {
      fetchAdminCenter();
    }
  }, [mounted, fetchAdminCenter]);

  const fetchCourses = useCallback(async () => {
    if (!mounted || !centerName || !checkAuth()) return;

    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/marks/center-scores`,
        {
          headers: { token },
          params: { centerName },
        }
      );

      setCourses(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          if (mounted) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            router.push("/auth/login/admin");
          }
          return;
        }

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load courses"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [mounted, centerName, checkAuth, router]);

  useEffect(() => {
    if (centerName) {
      fetchCourses();
    }
  }, [centerName, fetchCourses, refreshTrigger]);

  const handleUpdateScore = async (updatedItem: any) => {
    if (!mounted || !checkAuth()) return;

    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      if (!updatedItem.scoreId) {
        setError("Score ID is required for update");
        return;
      }

      const updateData = {
        scoreId: updatedItem.scoreId,
        marksObtained: Number(updatedItem.marksObtained) || 0,
        totalObtained: Number(updatedItem.totalObtained) || 100,
        dateOfExam: updatedItem.dateOfExam || new Date().toISOString(),
        name: updatedItem.name || "Exam",
        scoreType: updatedItem.scoreType || "FINAL",
      };

      await axios.put(
        `${backendUrl}/api/marks/edit-score`,
        updateData,
        { headers: { token } }
      );

      setRefreshTrigger((prev) => prev + 1);
      setError("");
    } catch (error: any) {
      console.error("Error updating score:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          if (mounted) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            router.push("/auth/login/admin");
          }
          return;
        }

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to update score"
        );
      } else {
        setError("Failed to update score");
      }
    }
  };

  const handleDeleteScore = async (id: string) => {
    if (!mounted || !checkAuth()) return;

    if (!id) {
      setError("Score ID is required for deletion");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      await axios.delete(`${backendUrl}/api/marks/delete-score`, {
        headers: { token },
        data: { scoreId: id },
      });

      setRefreshTrigger((prev) => prev + 1);
      setError("");
    } catch (error: any) {
      console.error("Error deleting score:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          if (mounted) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            router.push("/auth/login/admin");
          }
          return;
        }

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete score"
        );
      } else {
        setError("Failed to delete score");
      }
    }
  };

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const openScoresModal = useCallback((course: Course) => {
    const transformedCourse = {
      ...course,
      students: course.students.map((student) => ({
        ...student,
        scores: student.scores
          ? Array.isArray(student.scores)
            ? student.scores
            : [student.scores]
          : [],
      })),
    };
    setSelectedCourse(transformedCourse);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  }, []);

  if (!mounted) {
    return <Shimmer />;
  }

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
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalStudents = courses.reduce((total, course) => {
    return total + (course.students?.length || 0);
  }, 0);

  const transformedCourses: TableCourse[] = courses.map((course) => ({
    id: course.courseId,
    name: course.courseName,
    code: course.courseCode,
    credits: course.credits,
    teachers:
      course.teachers?.map((t) => t.name).join(", ") || "No teachers assigned",
    students: course.students?.length || 0,
    department: course.students?.[0]?.department || "N/A",
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Result Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Courses</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {courses.length}
            </p>
          </div>
        </div>

        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Students</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">{totalStudents}</p>
          </div>
        </div>

        <UploadSection
          onSuccess={triggerRefresh}
          uploadUrl="/api/marks/upload-marks"
          validExtensions={[".xlsx"]}
          schemaInfo={{
            title: "Upload Marks(Excel)",
            columns: ["student_id", "subject", "marks", "grade"],
            sampleRow: ["STU001", "Mathematics", "85", "A"],
            columnDescriptions: [
              {
                key: "student_id",
                description: "Unique identifier for the student",
              },
              { key: "subject", description: "Subject name" },
              { key: "marks", description: "Marks obtained (0-100)" },
              { key: "grade", description: "Grade assigned (A, B, C, D, F)" },
            ],
            guidelines: [
              "Ensure all student IDs are valid",
              "Marks should be between 0-100",
              "Use standard grade format (A, B, C, D, F)",
            ],
            commonIssues: [
              "Invalid student ID format",
              "Marks outside valid range",
              "Missing required columns",
            ],
            downloadLink:
              "https://glqns72ea6.ufs.sh/f/35ZKzNsv5By61oPdNSQHWyStvbcNAs0uUq6hILf7wZlnmxj8",
          }}
        />
      </div>

      <Table
        data={transformedCourses}
        title="Result Overview"
        filterField="department"
        badgeFields={["department"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
        }}
        nonEditableFields={["id", "students"]}
        hiddenColumns={["id"]}
        // onEdit={handleEditCourse}
        // onDelete={handleDeleteCourse}
        customRenderers={{
          students: (row) => (
            <button
              onClick={() => {
                const fullCourse = courses.find((c) => c.courseId === row.id);
                if (fullCourse) {
                  openScoresModal(fullCourse);
                }
              }}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 cursor-pointer"
              disabled={row.students === 0}
            >
              {row.students} students
            </button>
          ),
        }}
      />

      {isModalOpen && selectedCourse && (
        <StudentScoresModal
          course={selectedCourse}
          onClose={closeModal}
          onUpdateScore={handleUpdateScore}
          onDeleteScore={handleDeleteScore}
        />
      )}
    </div>
  );
}
