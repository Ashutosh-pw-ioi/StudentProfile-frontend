'use client';

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, FileText, ArrowLeft, Calendar, FolderOpen, Users, Trophy, Medal, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from 'next/navigation';
import axios from "axios";

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
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    [key: string]: unknown;
  }>;
  label?: string;
}

interface SemesterPerformance {
  semester: string;
  percentage: number;
  rank: number;
}

interface Subject {
  name: string;
  credits: number;
  grades: {
    midterm: number;
    assignment: number;
    final: number;
    overall: string;
  };
}

interface CategoryItem {
  name: string;
  score: number;
  total: number;
  percentage: number;
}

interface CategoryData {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: CategoryItem[];
}

interface Student {
  rank: number;
  name: string;
  percentage: number;
  avatar: string;
  location: string;
}

export default function AcademicsSection() {
  const [tokenPresent, setTokenPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [showAllGrades, setShowAllGrades] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setTokenPresent(!!token);
    if (!token) {
      router.push('/auth/login/student');
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        await axios.get<ApiResponse>('http://localhost:8000/api/student/get-student-profile', {
          headers: { "token": token },
        });
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/auth/login/student');
        } else {
          setError('Failed to validate session');
        }
      }
    };

    if (tokenPresent) {
      validateToken();
    }
  }, [tokenPresent, router]);

  const academicData = {
    cgpa: "8.5",
    semester: "4th",
    backlogs: "0",
    performanceRank: "15",
    overallRank: "12",
    semesterPerformance: [
      { semester: "Sem 1", percentage: 90, rank: 25 },
      { semester: "Sem 2", percentage: 75, rank: 18 },
      { semester: "Sem 3", percentage: 80, rank: 16 },
      { semester: "Sem 4", percentage: 78, rank: 15 },
    ] as SemesterPerformance[],
    subjects: [
      {
        name: "Data Analysis",
        credits: 4,
        grades: { midterm: 85, assignment: 92, final: 88, overall: "A" },
      },
      {
        name: "AI Basics",
        credits: 6,
        grades: { midterm: 78, assignment: 95, final: 82, overall: "A-" },
      },
      {
        name: "Statistical Inference",
        credits: 5,
        grades: { midterm: 90, assignment: 88, final: 91, overall: "A+" },
      },
      {
        name: "Signals & System",
        credits: 7,
        grades: { midterm: 75, assignment: 80, final: 78, overall: "B+" },
      },
      {
        name: "Database Systems",
        credits: 4,
        grades: { midterm: 88, assignment: 85, final: 89, overall: "A" },
      },
      {
        name: "Computer Networks",
        credits: 5,
        grades: { midterm: 82, assignment: 90, final: 85, overall: "A-" },
      },
    ] as Subject[],
    topStudents: [
      {
        rank: 1,
        name: "Arjun Sharma",
        percentage: 96.5,
        avatar: "AS",
        location: "Bangalore",
      },
      {
        rank: 2,
        name: "Priya Patel",
        percentage: 95.2,
        avatar: "PP",
        location: "Pune",
      },
      {
        rank: 3,
        name: "Rahul Gupta",
        percentage: 94.8,
        avatar: "RG",
        location: "Lucknow",
      },
    ] as Student[],
    allStudents: [
      {
        rank: 1,
        name: "Arjun Sharma",
        percentage: 96.5,
        avatar: "AS",
        location: "Bangalore",
      },
      {
        rank: 2,
        name: "Priya Patel",
        percentage: 95.2,
        avatar: "PP",
        location: "Pune",
      },
      {
        rank: 3,
        name: "Rahul Gupta",
        percentage: 94.8,
        avatar: "RG",
        location: "Lucknow",
      },
      {
        rank: 4,
        name: "Sneha Reddy",
        percentage: 93.1,
        avatar: "SR",
        location: "Hyderabad",
      },
      {
        rank: 5,
        name: "Vikram Singh",
        percentage: 92.7,
        avatar: "VS",
        location: "Delhi",
      },
      {
        rank: 6,
        name: "Anjali Mehta",
        percentage: 91.9,
        avatar: "AM",
        location: "Mumbai",
      },
      {
        rank: 7,
        name: "Karthik Nair",
        percentage: 90.8,
        avatar: "KN",
        location: "Chennai",
      },
      {
        rank: 8,
        name: "Ritu Agarwal",
        percentage: 89.5,
        avatar: "RA",
        location: "Jaipur",
      },
      {
        rank: 9,
        name: "Siddharth Joshi",
        percentage: 88.2,
        avatar: "SJ",
        location: "Ahmedabad",
      },
      {
        rank: 10,
        name: "Deepika Rao",
        percentage: 87.1,
        avatar: "DR",
        location: "Bangalore",
      },
    ] as Student[],
  };

  const categoryData: Record<string, CategoryData> = {
    "Fortnightly Tests": {
      icon: Calendar,
      color: "blue",
      data: [
        { name: "Test 1 - Fundamentals", score: 18, total: 20, percentage: 90 },
        { name: "Test 2 - Advanced Topics", score: 16, total: 20, percentage: 80 },
        { name: "Test 3 - Practical Applications", score: 19, total: 20, percentage: 95 },
        { name: "Test 4 - Comprehensive Review", score: 17, total: 20, percentage: 85 },
      ],
    },
    Projects: {
      icon: FolderOpen,
      color: "green",
      data: [
        { name: "Mini Project - Data Visualization", score: 47, total: 50, percentage: 94 },
        { name: "Group Project - ML Implementation", score: 45, total: 50, percentage: 90 },
        { name: "Final Project - Complete Solution", score: 48, total: 50, percentage: 96 },
        { name: "Research Project - Innovation", score: 46, total: 50, percentage: 92 },
      ],
    },
    Interviews: {
      icon: Users,
      color: "purple",
      data: [
        { name: "Technical Interview - Round 1", score: 28, total: 30, percentage: 93 },
        { name: "Technical Interview - Round 2", score: 26, total: 30, percentage: 87 },
        { name: "Behavioral Interview", score: 29, total: 30, percentage: 97 },
        { name: "Final Assessment Interview", score: 27, total: 30, percentage: 90 },
      ],
    },
  };

  const visibleSubjects = showAllGrades
    ? academicData.subjects
    : academicData.subjects.slice(0, 4);

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
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">
            #{rank}
          </span>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-500";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-500";
    }
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading academics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
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
            <h4 className="text-sm font-medium text-gray-600">CGPA</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {academicData.cgpa}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">
              Ongoing Semester
            </h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {academicData.semester}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">
              Active Backlogs
            </h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {academicData.backlogs}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Semester Performance Chart */}
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
                  data={academicData.semesterPerformance}
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
                  onClick={() => setIsLeaderboardModalOpen(true)}
                  className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {academicData.topStudents.map((student, index) => (
                <div
                  key={student.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0
                      ? "bg-yellow-50 border border-yellow-200"
                      : index === 1
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-amber-50 border border-amber-200"
                  }`}
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
                      {student.percentage}%
                    </p>
                  </div>
                </div>
              ))}
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
                  onClick={() => setIsLeaderboardModalOpen(true)}
                  className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {academicData.topStudents.map((student, index) => (
                <div
                  key={student.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0
                      ? "bg-yellow-50 border border-yellow-200"
                      : index === 1
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-amber-50 border border-amber-200"
                  }`}
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
                      {student.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
        <div className="bg-gray-200 px-6 py-4">
          <h4 className="font-semibold text-gray-900">Semester 4</h4>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-700">
                    Subjects
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
                {visibleSubjects.map((subject, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{subject.name}</td>
                    <td className="py-3 text-gray-600">{subject.credits}</td>
                    <td className="py-3 text-center">
                      <button
                        className="bg-[#1B3A6A] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#486AA0] duration-200 transition-all cursor-pointer ease-in-out"
                        onClick={() => openCategoryModal(subject.name)}
                      >
                        <FileText className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {academicData.subjects.length > 4 && (
            <button
              className="mt-4 bg-[#1B3A6A] text-white px-4 py-2 rounded-lg hover:bg-[#486AA0] transition-all flex items-center cursor-pointer ease-in-out duration-200"
              onClick={() => setShowAllGrades(!showAllGrades)}
            >
              {showAllGrades ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  View less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View more
                </>
              )}
            </button>
          )}
        </div>
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
              {selectedCategory && categoryData[selectedCategory]?.data.map((item, index) => {
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
                All Student Rankings
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
                {academicData.allStudents.map((student, index) => (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      index < 3
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
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
                        {student.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">Performance</p>
                    </div>
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