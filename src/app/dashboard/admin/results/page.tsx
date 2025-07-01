"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, Users, FileUp } from "lucide-react";
import UploadSection from "../UploadSection";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";
import StudentScoresModal from "./StudentScoresModal";

// Helper function to parse JWT token
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
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

export default function ResultManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login/admin");
    }
  }, [router]);

  // Fetch courses data
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const decoded = parseJwt(token);
      const isSuperAdmin = decoded?.role === "SUPER_ADMIN";
      
      let response;
      
      if (isSuperAdmin) {
        // For SUPER_ADMIN, we need to specify center in the body
        response = await axios.get(
          "http://localhost:8000/api/marks/center-scores",
          {
            headers: {
              token: token,
            },
            data: {
              centerName: decoded?.centerName || "Patna" // Default center if not specified
            }
          }
        );
      } else {
        // For ADMIN, center is derived from token
        response = await axios.get(
          "http://localhost:8000/api/marks/center-scores",
          {
            headers: {
              token: token,
            }
          }
        );
      }

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/admin");
        return;
      }

      const data = response.data;
      setCourses(data.data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, refreshTrigger]);

  // Update score handler
  const handleUpdateScore = async (updatedItem: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const updateData = {
        scoreId: updatedItem.scoreId,
        marksObtained: updatedItem.marksObtained,
        totalObtained: updatedItem.totalObtained || 100,
        dateOfExam: updatedItem.dateOfExam || new Date().toISOString(),
        name: updatedItem.name || "Exam",
        scoreType: updatedItem.scoreType || "FINAL"
      };

      const response = await axios.put(
        "http://localhost:8000/api/marks/edit-score",
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
      console.error("Error updating score:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/admin");
        return;
      }
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update score"
      );
    }
  };

  // Delete score handler
  const handleDeleteScore = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const response = await axios.delete(
        "http://localhost:8000/api/marks/delete-score",
        {
          headers: {
            token: token,
          },
          data: { scoreId: id }
        }
      );

      // Refresh data after delete
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error deleting score:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/admin");
        return;
      }
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete score"
      );
    }
  };

  // Trigger refresh after upload
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleStudentClick = (course: Course, student: any) => {
    setSelectedCourse(course);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setSelectedCourse(null);
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

  // Calculate total students across all courses
  const totalStudents = courses.reduce((total, course) => {
    return total + (course.students?.length || 0);
  }, 0);

  // Transform course data for the table
  const transformedCourses = courses.map(course => ({
    id: course.courseId,
    name: course.courseName,
    code: course.courseCode,
    credits: course.credits,
    teachers: course.teachers.map(t => t.name).join(", "),
    students: course.students?.length || 0,
    department: course.students?.[0]?.department || "N/A"
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Result Management
        </h2>
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
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {totalStudents}
            </p>
          </div>
        </div>
        
        <UploadSection 
          onSuccess={triggerRefresh} 
          endpoint="/api/marks/upload-marks"
          accept=".xlsx"
          title="Upload Marks (Excel)"
        />
      </div>

      <Table
        data={transformedCourses}
        title="Courses Overview"
        filterField="department"
        badgeFields={["department"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
        }}
        nonEditableFields={["id", "students"]}
        hiddenColumns={["id"]}
        onEdit={handleUpdateScore}
        onDelete={handleDeleteScore}
        customRenderers={{  
          students: (value, row) => (
            <button 
              onClick={() => {
                const fullCourse = courses.find(c => c.courseId === row.id);
                if (fullCourse) {
                  setSelectedCourse(fullCourse);
                  setIsModalOpen(true);
                }
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {value} students
            </button>
          )
        }}
      />

      {isModalOpen && selectedCourse && (
        <StudentScoresModal
          course={selectedCourse}
          student={selectedStudent}
          onClose={closeModal}
          onUpdateScore={handleUpdateScore}
          onDeleteScore={handleDeleteScore}
        />
      )}
    </div>
  );
}