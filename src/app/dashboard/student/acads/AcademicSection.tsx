"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, ArrowLeft, Users, Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  getSemesterPerformance,
  getBatchTopStudents,
  getDepartmentTopStudents,
  getAllStudents,
  getRankIcon,
  getRankColor,
  getSemesterFromCode,
  getOngoingCourses,
  getUniqueSemesters,
  getFilteredCompletedCourses,
} from "./utitls/utils";
import categoryData from "../constants/CategoryData";

interface ApiResponse {
  success: boolean;
  data: any;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    [key: string]: unknown;
  }>;
  label?: string;
}

export default function AcademicsSection() {
  const [tokenPresent, setTokenPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [academicsData, setAcademicsData] = useState<any>(null);
  const [batchLeaderboard, setBatchLeaderboard] = useState<any>(null);
  const [departmentLeaderboard, setDepartmentLeaderboard] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<
    "batch" | "department"
  >("batch");

  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setTokenPresent(!!token);
    if (!token) {
      router.push("/auth/login/student");
    } else {
      setLoading(false);
      fetchData(token);
    }
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const profileRes = await axios.get<ApiResponse>(
        "http://localhost:8000/api/student/get-student-profile",
        { headers: { token: token } }
      );
      setStudentProfile(profileRes.data.data);

      const [academicsRes, batchRes, deptRes] = await Promise.all([
        axios.get<ApiResponse>(
          "http://localhost:8000/api/student/get-student-academics",
          {
            headers: { token: token },
          }
        ),
        axios.get<ApiResponse>(
          "http://localhost:8000/api/student/get-batch-leaderboard",
          {
            headers: { token: token },
          }
        ),
        axios.get<ApiResponse>(
          "http://localhost:8000/api/student/get-department-leaderboard",
          {
            headers: { token: token },
          }
        ),
      ]);

      setAcademicsData(academicsRes.data.data);
      setBatchLeaderboard(batchRes.data.data);
      setDepartmentLeaderboard(deptRes.data.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/student");
      } else {
        setError("Failed to fetch data");
      }
    }
  };

  const openBatchLeaderboardModal = () => {
    setLeaderboardType("batch");
    setIsLeaderboardModalOpen(true);
  };

  const openDepartmentLeaderboardModal = () => {
    setLeaderboardType("department");
    setIsLeaderboardModalOpen(true);
  };

  const openCategoryModal = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setSelectedCategory(null);
  };

  const openCategoryDetail = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const backToCategories = () => {
    setSelectedCategory(null);
  };

  const closeCategoryModal = () => {
    setSelectedSubject(null);
    setSelectedCategory(null);
  };

  const LeaderboardTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (!tokenPresent || loading) {
    return <AcademicsShimmer />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (
    !academicsData ||
    !batchLeaderboard ||
    !departmentLeaderboard ||
    !studentProfile
  ) {
    return <AcademicsShimmer />;
  }

  const ongoingCourses = getOngoingCourses(academicsData, studentProfile);

  function AcademicsShimmer() {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
            >
              <div className="text-center pb-2 pt-6">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
              <div className="text-center pt-0 pb-6">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
            >
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
          <div className="bg-gray-200 px-6 py-4">
            <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[1, 2, 3, 4].map((i) => (
                      <th key={i} className="text-left py-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
          <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[1, 2, 3, 4].map((i) => (
                      <th key={i} className="text-left py-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Academics & Courses
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">Batch</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {studentProfile.batch?.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">
              Current Semester
            </h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {studentProfile.semesterNo}th
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">
              Active Courses
            </h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {ongoingCourses.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-gray-800">
                Semester-wise Performance Progress
              </h4>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getSemesterPerformance()}
                  margin={{ top: 15, right: 10, left: -30, bottom: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="semester"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip content={<LeaderboardTooltip />} />
                  <Bar
                    dataKey="percentage"
                    fill="#486AA0"
                    radius={[4, 4, 0, 0]}
                    name="Performance"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                Class Leaderboard
              </h4>
              <div className="flex justify-end mb-4 w-full">
                <button
                  onClick={openBatchLeaderboardModal}
                  className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {getBatchTopStudents(batchLeaderboard, studentProfile).map(
                (student, index) => (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      student.isCurrentUser
                        ? "bg-blue-100 border border-blue-300"
                        : index === 0
                        ? "bg-yellow-50 border border-yellow-200"
                        : index === 1
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-amber-50 border border-amber-200"
                    } ${student.isCurrentUser ? "ring-2 ring-blue-400" : ""}`}
                  >
                    <div className="flex items-center justify-center">
                      {getRankIcon(student.rank)}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full ${getRankColor(
                        student.rank
                      )} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {student.percentage} marks
                      </p>
                    </div>
                    {student.isCurrentUser && (
                      <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        You
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                Overall Leaderboard
              </h4>
              <div className="flex justify-end mb-4 w-full">
                <button
                  onClick={openDepartmentLeaderboardModal}
                  className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {getDepartmentTopStudents(
                departmentLeaderboard,
                studentProfile
              ).map((student, index) => (
                <div
                  key={student.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    student.isCurrentUser
                      ? "bg-blue-100 border border-blue-300"
                      : index === 0
                      ? "bg-yellow-50 border border-yellow-200"
                      : index === 1
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-amber-50 border border-amber-200"
                  } ${student.isCurrentUser ? "ring-2 ring-blue-400" : ""}`}
                >
                  <div className="flex items-center justify-center">
                    {getRankIcon(student.rank)}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full ${getRankColor(
                      student.rank
                    )} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {student.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {student.percentage} marks
                    </p>
                  </div>
                  {student.isCurrentUser && (
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      You
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
        <div className="bg-gray-200 px-6 py-4">
          <h4 className="font-semibold text-gray-900">
            Ongoing Courses - Semester {studentProfile.semesterNo}
          </h4>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-700">
                    Semester
                  </th>

                  <th className="text-left py-3 font-semibold text-gray-700">
                    Credits
                  </th>
                  <th className="text-center py-3 font-semibold text-gray-700">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {ongoingCourses.map((course, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{course.code}</td>
                    <td className="py-3 text-gray-600">
                      Semester {getSemesterFromCode(course.code)}
                    </td>
                    <td className="py-3 text-gray-600">{course.credits}</td>
                    <td className="py-3 text-center">
                      <button
                        className="bg-[#1B3A6A] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#486AA0] duration-200 transition-all cursor-pointer ease-in-out"
                        onClick={() => openCategoryModal(course.name)}
                      >
                        <FileText className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
        <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
          <h4 className="font-semibold text-gray-900">Completed Courses</h4>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              className="bg-white rounded-lg px-3 py-1 text-sm border border-gray-300"
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                )
              }
            >
              <option value="all">All Semesters</option>
              {getUniqueSemesters(academicsData, studentProfile).map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <button
              className="ml-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowCompletedCourses(!showCompletedCourses)}
            >
              {showCompletedCourses ? "Hide" : "Show"} Courses
            </button>
          </div>
        </div>

        {showCompletedCourses && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Code
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Semester
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Credits
                    </th>
                    <th className="text-center py-3 font-semibold text-gray-700">
                      View Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredCompletedCourses(
                    academicsData,
                    studentProfile,
                    semesterFilter
                  ).map((course, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{course.code}</td>
                      <td className="py-3 text-gray-600">
                        Semester {getSemesterFromCode(course.code)}
                      </td>
                      <td className="py-3 text-gray-600">{course.credits}</td>
                      <td className="py-3 text-center">
                        <button
                          className="bg-[#1B3A6A] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#486AA0] duration-200 transition-all cursor-pointer ease-in-out"
                          onClick={() => openCategoryModal(course.name)}
                        >
                          <FileText className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedSubject && !selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedSubject} - Assessment Categories
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                onClick={closeCategoryModal}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(categoryData).map(([categoryName, category]) => {
                const IconComponent = category.icon;
                const totalScore = category.data.reduce(
                  (sum, item) => sum + item.score,
                  0
                );
                const totalMax = category.data.reduce(
                  (sum, item) => sum + item.total,
                  0
                );
                const averagePercentage = Math.round(
                  (totalScore / totalMax) * 100
                );

                return (
                  <div
                    key={categoryName}
                    className="bg-[#FFD990] rounded-xl p-6 cursor-pointer transition-all duration-200 ease-in-out"
                    onClick={() => openCategoryDetail(categoryName)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8 text-[#1B3A6A]" />
                      <span className="text-sm px-3 py-1 rounded-full font-semibold bg-white text-[#1B3A6A]">
                        {category.data.length} items
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {categoryName}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Score:</span>
                        <span className="font-semibold">
                          {totalScore}/{totalMax}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Average:</span>
                        <span className="font-semibold">
                          {averagePercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div
                          style={{ width: `${averagePercentage}%` }}
                          className="h-2 rounded-full bg-[#1B3A6A]"
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedSubject && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={backToCategories}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 cursor-pointer" />
                </button>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedSubject} - {selectedCategory}
                </h3>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                onClick={closeCategoryModal}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedCategory &&
                categoryData[selectedCategory]?.data.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-xl p-6 border bg-[#FFD990]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-gray-900 flex-1 pr-4">
                          {item.name}
                        </h4>
                        <span className="text-2xl font-bold text-[#1B3A6A]">
                          {item.percentage}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Score:
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {item.score}/{item.total}
                          </span>
                        </div>

                        <div className="w-full bg-white rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-[#1B3A6A]"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Performance:</span>
                          <span
                            className={`font-semibold bg-white rounded-full text-sm px-2 ${
                              item.percentage >= 90
                                ? "text-green-600"
                                : item.percentage >= 80
                                ? "text-blue-600"
                                : item.percentage >= 70
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.percentage >= 90
                              ? "Excellent"
                              : item.percentage >= 80
                              ? "Good"
                              : item.percentage >= 70
                              ? "Average"
                              : "Needs Improvement"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={backToCategories}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center cursor-pointer duration-200 ease-in-out"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </button>
                <button
                  onClick={closeCategoryModal}
                  className="flex-1 bg-[#1B3A6A] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#486AA0] transition-colors duration-200 ease-in-out cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLeaderboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {leaderboardType === "batch" ? "Batch" : "Department"}{" "}
                Leaderboard
              </h2>
              <button
                onClick={() => setIsLeaderboardModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 cursor-pointer" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {getAllStudents(
                  leaderboardType,
                  batchLeaderboard,
                  departmentLeaderboard,
                  studentProfile
                ).map((student) => (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      student.isCurrentUser
                        ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400"
                        : "bg-gray-50 border-gray-200"
                    } hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="flex items-center justify-center">
                      {getRankIcon(student.rank)}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full ${getRankColor(
                        student.rank
                      )} flex items-center justify-center text-white font-bold`}
                    >
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {student.name}
                      </p>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {student.location}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">
                        {student.percentage} marks
                      </p>
                      <p className="text-xs text-gray-500">
                        Rank: {student.rank}
                      </p>
                    </div>
                    {student.isCurrentUser && (
                      <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        You
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
