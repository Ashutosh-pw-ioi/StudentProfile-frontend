"use client";

import React, { useEffect, useState } from "react";
import { User, ArrowUpRight, X, BookOpen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CourseDetail {
  id: string;
  name: string;
  code: string;
  credits: number;
  studentsCount: number;
  semester: number;
  batch: string;
  department: string;
}

interface TeacherData {
  id: string;
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  experience: number;
  centerCity: string;
  department: string;
  statistics: {
    totalCourses: number;
    totalStudents: number;
    coursesDetails: CourseDetail[];
  };
}

const ProfileSkeleton = () => (
  <div className="space-y-6 relative">
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
    
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-8">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((item) => (
        <div 
          key={item}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-6"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>

    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[1, 2, 3, 4].map((item) => (
          <div 
            key={item} 
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((item) => (
        <div 
          key={item}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-6"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function TeacherProfile() {
  const [showActiveCourses, setShowActiveCourses] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login/teacher");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/teacher/teacher-profile",
          { headers: { "token": token } }
        );

        if (response.data.success) {
          setTeacherData(response.data.data);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data");
        setTimeout(() => {
          router.push("/auth/login/teacher");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-4 rounded-lg max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-8 py-4 rounded-lg max-w-md">
          <p>No profile data found. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Teacher Profile</h2>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {teacherData.name || "N/A"}
            </h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className="text-sm px-4 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full">
                {teacherData.centerCity || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["Department", teacherData.department || "N/A"],
          ["Experience", teacherData.experience + " years" || "N/A"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 text-center py-6"
          >
            <h4 className="text-sm font-medium text-gray-600">{label}</h4>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-6">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            {[
              ["Gender", teacherData.gender || "N/A"],
              ["Email", teacherData.email || "N/A"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <span className="font-medium text-gray-600 text-sm uppercase">
                  {label}
                </span>
                <span className="text-gray-800 font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              ["Mobile", teacherData.phoneNumber || "N/A"],
              ["Center City", teacherData.centerCity || "N/A"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <span className="font-medium text-gray-600 text-sm uppercase">
                  {label}
                </span>
                <span className="text-gray-800 font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 relative">
          <button
            onClick={() => setShowActiveCourses(true)}
            className="absolute top-4 right-4 text-[#1B3A6A]"
            aria-label="View Active Courses"
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <div className="text-center pt-6 pb-2">
            <h4 className="text-lg font-medium text-[#1B3A6A]">
              Active Courses
            </h4>
          </div>
          <div className="text-center pb-6">
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {teacherData.statistics?.totalCourses ?? "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pt-6 pb-2">
            <h4 className="text-lg font-medium text-gray-600">
              Total Students
            </h4>
          </div>
          <div className="text-center pb-6">
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {teacherData.statistics?.totalStudents ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {showActiveCourses && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#1B3A6A]" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Active Courses
                </h3>
              </div>
              <button
                onClick={() => setShowActiveCourses(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid gap-4">
              {teacherData.statistics?.coursesDetails?.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#FFD990] rounded-lg p-6 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-xl font-bold text-gray-800">
                          {course.name}
                        </h4>
                        <span className="text-sm px-3 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full font-medium">
                          {course.code}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1B3A6A]">
                              Batch:
                            </span>
                            <span className="text-sm text-gray-800">
                              {course.batch}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1B3A6A]">
                              Semester:
                            </span>
                            <span className="text-sm text-gray-800">
                              {course.semester}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Users className="w-4 h-4 text-[#1B3A6A]" />
                      <div className="text-sm font-medium text-gray-600">
                        Students
                      </div>
                      <div className="text-3xl font-bold text-[#1B3A6A]">
                        {course.studentsCount}
                      </div>
                    </div>
                  </div>
                </div>
              )) || <p className="text-center py-8">No active courses found</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}