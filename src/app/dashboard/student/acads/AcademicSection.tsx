"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  Trophy,
  Medal,
  Award,
  Filter,
  ChevronDown,
} from "lucide-react";
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
import { academicData } from "../constants/AcadsData";
import {
  getSemesterFromCode,
  getOngoingCourses,
  getUniqueSemesters,
  getFilteredCompletedCourses,
} from "./utitls/utils";

const academicsData = academicData;

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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AcademicsSection() {
  const [tokenPresent, setTokenPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [apiAcademicsData, setApiAcademicsData] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [selectedCourse, setSelectedCourse] = useState<string>("os");
  const [selectedTestType, setSelectedTestType] =
    useState<string>("fortnightlyTest");
  const [selectedTestNumber, setSelectedTestNumber] = useState<string>("ft1");

  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<"class" | "overall">(
    "class"
  );

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
        `${backendUrl}/api/student/get-student-profile`,
        { headers: { token: token } }
      );
      setStudentProfile(profileRes.data.data);

      const [academicsRes] = await Promise.all([
        axios.get<ApiResponse>(
          `${backendUrl}/api/student/get-student-academics`,
          {
            headers: { token: token },
          }
        ),
      ]);

      setApiAcademicsData(academicsRes.data.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/auth/login/student");
      } else {
        setError("Failed to fetch data");
      }
    }
  };

  const getAvailableSemesters = () => {
    return academicsData.map((sem) => sem.semester);
  };

  const getCoursesForSemester = (semester: number) => {
    const semData = academicsData.find((sem) => sem.semester === semester);
    return semData ? semData.courses.map((course) => course.name) : [];
  };

  const getTestTypesForCourse = (semester: number, courseName: string) => {
    const semData = academicsData.find((sem) => sem.semester === semester);
    const courseData = semData?.courses.find(
      (course) => course.name === courseName
    );
    return courseData ? Object.keys(courseData.exams) : [];
  };

  const getTestNumbersForType = (
    semester: number,
    courseName: string,
    testType: string
  ) => {
    const semData = academicsData.find((sem) => sem.semester === semester);
    const courseData = semData?.courses.find(
      (course) => course.name === courseName
    );
    if (!courseData) return [];

    const tests = courseData.exams[testType as keyof typeof courseData.exams];
    return tests ? tests.map((test) => test.test) : [];
  };

  const getChartData = () => {
    const semData = academicsData.find(
      (sem) => sem.semester === selectedSemester
    );
    const courseData = semData?.courses.find(
      (course) => course.name === selectedCourse
    );
    if (!courseData) return [];

    const tests =
      courseData.exams[selectedTestType as keyof typeof courseData.exams];
    return tests.map((test) => ({
      test: test.test,
      percentage: Math.round((test.studentMarks / test.maxMarks) * 100),
      marks: test.studentMarks,
      maxMarks: test.maxMarks,
    }));
  };

  const getLeaderboardData = (type: "class" | "overall") => {
    const semData = academicsData.find(
      (sem) => sem.semester === selectedSemester
    );
    const courseData = semData?.courses.find(
      (course) => course.name === selectedCourse
    );
    if (!courseData) return [];

    const tests =
      courseData.exams[selectedTestType as keyof typeof courseData.exams];
    const selectedTest = tests.find((test) => test.test === selectedTestNumber);
    if (!selectedTest) return [];

    const currentRank =
      type === "class" ? selectedTest.classRank : selectedTest.overallRank;
    const totalStudents = type === "class" ? 30 : 120;

    const leaderboard = [];
    for (let i = 1; i <= Math.min(10, totalStudents); i++) {
      const isCurrentUser = i === currentRank;
      const baseScore = selectedTest.studentMarks;
      const variance = (currentRank - i) * 2;
      const studentScore = Math.max(
        0,
        Math.min(selectedTest.maxMarks, baseScore + variance)
      );

      leaderboard.push({
        rank: i,
        name: isCurrentUser ? "You" : `Student ${i}`,
        avatar: isCurrentUser ? "Y" : `S${i}`,
        marks: studentScore,
        percentage: Math.round((studentScore / selectedTest.maxMarks) * 100),
        isCurrentUser,
        location:
          type === "class" ? `Batch ${selectedSemester}` : `Department CS`,
      });
    }

    return leaderboard;
  };

  const getRankIconDummy = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">
        #{rank}
      </span>
    );
  };

  const getRankColorDummy = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-blue-500";
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

  const openLeaderboardModal = (type: "class" | "overall") => {
    setLeaderboardType(type);
    setIsLeaderboardModalOpen(true);
  };

  useEffect(() => {
    const courses = getCoursesForSemester(selectedSemester);
    if (courses.length > 0 && !courses.includes(selectedCourse)) {
      setSelectedCourse(courses[0]);
    }
  }, [selectedSemester]);

  useEffect(() => {
    const testTypes = getTestTypesForCourse(selectedSemester, selectedCourse);
    if (testTypes.length > 0 && !testTypes.includes(selectedTestType)) {
      setSelectedTestType(testTypes[0]);
    }
  }, [selectedSemester, selectedCourse]);

  useEffect(() => {
    const testNumbers = getTestNumbersForType(
      selectedSemester,
      selectedCourse,
      selectedTestType
    );
    if (testNumbers.length > 0 && !testNumbers.includes(selectedTestNumber)) {
      setSelectedTestNumber(testNumbers[0]);
    }
  }, [selectedSemester, selectedCourse, selectedTestType]);

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

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    );
  }

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

  if (!apiAcademicsData || !studentProfile) {
    return <AcademicsShimmer />;
  }

  const ongoingCourses = getOngoingCourses(apiAcademicsData, studentProfile);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Academics & Performance
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

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <div className="relative">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              >
                {getAvailableSemesters().map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <div className="relative flex">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {getCoursesForSemester(selectedSemester).map((course) => (
                  <option key={course} value={course}>
                    {course.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <div className="relative">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={selectedTestType}
                onChange={(e) => setSelectedTestType(e.target.value)}
              >
                {getTestTypesForCourse(selectedSemester, selectedCourse).map(
                  (type) => (
                    <option key={type} value={type}>
                      {type === "fortnightlyTest"
                        ? "Fortnightly Test"
                        : type === "internalAssessment"
                        ? "Internal Assessment"
                        : "Interview"}
                    </option>
                  )
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Number
            </label>
            <div className="relative">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={selectedTestNumber}
                onChange={(e) => setSelectedTestNumber(e.target.value)}
              >
                {getTestNumbersForType(
                  selectedSemester,
                  selectedCourse,
                  selectedTestType
                ).map((test) => (
                  <option key={test} value={test}>
                    {test.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">
              {selectedCourse.toUpperCase()} -{" "}
              {selectedTestType === "fortnightlyTest"
                ? "Fortnightly Tests"
                : selectedTestType === "internalAssessment"
                ? "Internal Assessments"
                : "Interviews"}{" "}
              Performance
            </h4>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getChartData()}
                margin={{ top: 15, right: 10, left: -30, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="test"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis
                  domain={[0, 100]}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                Class Leaderboard - {selectedTestNumber.toUpperCase()}
              </h4>
              <button
                onClick={() => openLeaderboardModal("class")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
              >
                <div className="flex gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </div>
              </button>
            </div>

            <div className="space-y-3">
              {getLeaderboardData("class")
                .slice(0, 3)
                .map((student) => (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      student.isCurrentUser
                        ? "bg-blue-100 border border-blue-300 ring-2 ring-blue-400"
                        : student.rank === 1
                        ? "bg-yellow-50 border border-yellow-200"
                        : student.rank === 2
                        ? "bg-gray-50 border border-gray-200"
                        : student.rank === 3
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {getRankIconDummy(student.rank)}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full ${getRankColorDummy(
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
                        {student.marks} marks ({student.percentage}%)
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

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                Overall Leaderboard - {selectedTestNumber.toUpperCase()}
              </h4>
              <button
                onClick={() => openLeaderboardModal("overall")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
              >
                <div className="flex gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </div>
              </button>
            </div>

            <div className="space-y-3">
              {getLeaderboardData("overall")
                .slice(0, 3)
                .map((student) => (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      student.isCurrentUser
                        ? "bg-blue-100 border border-blue-300 ring-2 ring-blue-400"
                        : student.rank === 1
                        ? "bg-yellow-50 border border-yellow-200"
                        : student.rank === 2
                        ? "bg-gray-50 border border-gray-200"
                        : student.rank === 3
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {getRankIconDummy(student.rank)}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full ${getRankColorDummy(
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
                        {student.marks} marks ({student.percentage}%)
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

            <div className="relative">
              <select
                className="bg-white rounded-lg px-3 py-1 pr-8 text-sm border border-gray-300 appearance-none cursor-pointer"
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(
                    e.target.value === "all" ? "all" : parseInt(e.target.value)
                  )
                }
              >
                <option value="all">All Semesters</option>
                {getUniqueSemesters(apiAcademicsData, studentProfile).map(
                  (sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  )
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <button
              className="ml-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
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
                  </tr>
                </thead>
                <tbody>
                  {getFilteredCompletedCourses(
                    apiAcademicsData,
                    studentProfile,
                    semesterFilter
                  ).map((course, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{course.code}</td>
                      <td className="py-3 text-gray-600">
                        Semester {getSemesterFromCode(course.code)}
                      </td>
                      <td className="py-3 text-gray-600">{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isLeaderboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {leaderboardType === "class" ? "Class" : "Overall"} Leaderboard
                - {selectedTestNumber.toUpperCase()}
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
                {getLeaderboardData(leaderboardType).map((student) => (
                  <div
                    key={student.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      student.isCurrentUser
                        ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400"
                        : "bg-gray-50 border-gray-200"
                    } hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="flex items-center justify-center">
                      {getRankIconDummy(student.rank)}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full ${getRankColorDummy(
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
                        {student.marks} marks
                      </p>
                      <p className="text-xs text-gray-500">
                        Rank: {student.rank} ({student.percentage}%)
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
