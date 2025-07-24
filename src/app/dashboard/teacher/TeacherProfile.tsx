"use client";

import React, { useEffect, useState } from "react";
import { User, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProfileSkeleton from "./Skeletons/Profile";
import ActiveCoursesModal from "./Modals/ActiveCoursesModal";
import { CourseDetail } from "./interfaces/CourseDetails";
const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL

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
          `${backendUrl}/api/teacher/teacher-profile`,
          { headers: { token: token } }
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Teacher Profile</h2>

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
            className="absolute top-4 right-4 text-[#1B3A6A] cursor-pointer"
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

      <ActiveCoursesModal
        isOpen={showActiveCourses}
        onClose={() => setShowActiveCourses(false)}
        courses={teacherData.statistics?.coursesDetails || []}
      />
    </div>
  );
}
