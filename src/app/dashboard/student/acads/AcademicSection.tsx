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
  AlertCircle,
  RefreshCw,
  RotateCcw,
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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// TypeScript Interfaces
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    [key: string]: unknown;
  }>;
  label?: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  enrollmentNumber: string;
  semesterNo: number;
  center: { name: string };
  department: { name: string };
  batch: { name: string };
  courseCount: number;
}

interface CourseScore {
  id: string;
  marksObtained: number;
  totalObtained: number;
  dateOfExam: string;
  gradedAt: string;
}

interface LeaderboardStudent {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  totalMarks: number;
  rank: number;
  center?: { name: string };
}

interface AcademicData {
  id: string;
  courses: Course[];
  scores: Array<{
    id: string;
    marksObtained: number;
    scoreType: string;
    course: Course;
  }>;
}

interface ErrorState {
  profile: string | null;
  academics: string | null;
  scores: string | null;
  batchLeaderboard: string | null;
  departmentLeaderboard: string | null;
}

interface FilterState {
  semester: number;
  course: string;
  testType: string;
  testNumber: string;
}

export default function AcademicsSection() {
  const [tokenPresent, setTokenPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<ErrorState>({
    profile: null,
    academics: null,
    scores: null,
    batchLeaderboard: null,
    departmentLeaderboard: null,
  });
  const router = useRouter();

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [courseScores, setCourseScores] = useState<CourseScore[]>([]);
  const [batchLeaderboard, setBatchLeaderboard] = useState<LeaderboardStudent[]>([]);
  const [departmentLeaderboard, setDepartmentLeaderboard] = useState<LeaderboardStudent[]>([]);

  // Current active filters (used for API calls and data display)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    semester: 1,
    course: "",
    testType: "FORTNIGHTLY_TEST",
    testNumber: "1"
  });

  // Pending filters (user selections before clicking update)
  const [pendingFilters, setPendingFilters] = useState<FilterState>({
    semester: 1,
    course: "",
    testType: "FORTNIGHTLY_TEST",
    testNumber: "1"
  });

  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<"class" | "overall">("class");

  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);

  // Loading states for different sections
  const [loadingStates, setLoadingStates] = useState({
    scores: false,
    batchLeaderboard: false,
    departmentLeaderboard: false,
    updating: false,
  });

  // Check if filters have changed
  const hasFiltersChanged = () => {
    return (
      pendingFilters.semester !== activeFilters.semester ||
      pendingFilters.course !== activeFilters.course ||
      pendingFilters.testType !== activeFilters.testType ||
      pendingFilters.testNumber !== activeFilters.testNumber
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setTokenPresent(!!token);
    if (!token) {
      router.push("/auth/login/student");
    } else {
      setLoading(false);
      fetchInitialData(token);
    }
  }, [router]);

  const clearError = (field: keyof ErrorState) => {
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const setError = (field: keyof ErrorState, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const fetchInitialData = async (token: string) => {
    try {
      // Fetch student profile
      clearError('profile');
      const profileRes = await axios.get<ApiResponse<StudentProfile>>(
        `${backendUrl}/api/student/get-student-profile`,
        { headers: { token: token } }
      );
      
      if (!profileRes.data.success) {
        throw new Error(profileRes.data.message || "Failed to fetch profile");
      }
      
      setStudentProfile(profileRes.data.data);

      // Fetch academic data
      clearError('academics');
      const academicsRes = await axios.get<ApiResponse<AcademicData>>(
        `${backendUrl}/api/student/get-student-academics`,
        { headers: { token: token } }
      );
      
      if (!academicsRes.data.success) {
        throw new Error(academicsRes.data.message || "Failed to fetch academic data");
      }
      
      setAcademicData(academicsRes.data.data);

      // Set initial course selection
      if (academicsRes.data.data.courses.length > 0) {
        const initialCourse = academicsRes.data.data.courses[0].code;
        setActiveFilters(prev => ({ ...prev, course: initialCourse }));
        setPendingFilters(prev => ({ ...prev, course: initialCourse }));
        
        // Fetch initial data for the first course
        fetchPerformanceData(token, {
          semester: 1,
          course: initialCourse,
          testType: "FORTNIGHTLY_TEST",
          testNumber: "1"
        });
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/auth/login/student");
        } else {
          const errorMessage = err.response?.data?.message || err.message || "Network error occurred";
          setError('profile', errorMessage);
          setError('academics', errorMessage);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError('profile', errorMessage);
        setError('academics', errorMessage);
      }
    }
  };

  const fetchPerformanceData = async (token: string, filters: FilterState) => {
    if (!filters.course) return;

    // Set all loading states
    setLoadingStates(prev => ({ 
      ...prev, 
      scores: true, 
      batchLeaderboard: true, 
      departmentLeaderboard: true,
      updating: true
    }));

    // Clear all errors
    clearError('scores');
    clearError('batchLeaderboard');
    clearError('departmentLeaderboard');

    try {
      // Fetch all data in parallel
      const [scoresRes, batchRes, deptRes] = await Promise.allSettled([
        axios.post<{ scores: CourseScore[] }>(
          `${backendUrl}/api/student/get-course-graph`,
          { 
            courseCode: filters.course, 
            scoreType: filters.testType, 
            semester: filters.semester 
          },
          { headers: { token: token } }
        ),
        axios.post<ApiResponse<{ students: LeaderboardStudent[] }>>(
          `${backendUrl}/api/student/get-batch-leaderboard`,
          { 
            courseCode: filters.course, 
            scoreType: filters.testType, 
            semester: filters.semester 
          },
          { headers: { token: token } }
        ),
        axios.post<ApiResponse<{ students: LeaderboardStudent[] }>>(
          `${backendUrl}/api/student/get-department-leaderboard`,
          { 
            courseCode: filters.course, 
            scoreType: filters.testType, 
            semester: filters.semester 
          },
          { headers: { token: token } }
        )
      ]);

      // Handle scores
      if (scoresRes.status === 'fulfilled') {
        setCourseScores(scoresRes.value.data.scores || []);
        setLoadingStates(prev => ({ ...prev, scores: false }));
      } else {
        const error = scoresRes.reason;
        let errorMessage = "Failed to fetch course scores";
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/auth/login/student");
            return;
          }
          errorMessage = error.response?.data?.message || error.message || errorMessage;
        }
        setError('scores', errorMessage);
        setCourseScores([]);
        setLoadingStates(prev => ({ ...prev, scores: false }));
      }

      // Handle batch leaderboard
      if (batchRes.status === 'fulfilled') {
        const response = batchRes.value;
        if (response.data.success) {
          setBatchLeaderboard(response.data.data.students || []);
        } else {
          setError('batchLeaderboard', response.data.message || "Failed to fetch batch leaderboard");
          setBatchLeaderboard([]);
        }
        setLoadingStates(prev => ({ ...prev, batchLeaderboard: false }));
      } else {
        const error = batchRes.reason;
        let errorMessage = "Failed to fetch batch leaderboard";
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/auth/login/student");
            return;
          }
          errorMessage = error.response?.data?.message || error.message || errorMessage;
        }
        setError('batchLeaderboard', errorMessage);
        setBatchLeaderboard([]);
        setLoadingStates(prev => ({ ...prev, batchLeaderboard: false }));
      }

      // Handle department leaderboard
      if (deptRes.status === 'fulfilled') {
        const response = deptRes.value;
        if (response.data.success) {
          setDepartmentLeaderboard(response.data.data.students || []);
        } else {
          setError('departmentLeaderboard', response.data.message || "Failed to fetch department leaderboard");
          setDepartmentLeaderboard([]);
        }
        setLoadingStates(prev => ({ ...prev, departmentLeaderboard: false }));
      } else {
        const error = deptRes.reason;
        let errorMessage = "Failed to fetch department leaderboard";
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/auth/login/student");
            return;
          }
          errorMessage = error.response?.data?.message || error.message || errorMessage;
        }
        setError('departmentLeaderboard', errorMessage);
        setDepartmentLeaderboard([]);
        setLoadingStates(prev => ({ ...prev, departmentLeaderboard: false }));
      }

      // Update active filters after successful fetch
      setActiveFilters(filters);

    } catch (err) {
      console.error("Unexpected error in fetchPerformanceData:", err);
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  };

  const handleUpdateFilters = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login/student");
      return;
    }

    fetchPerformanceData(token, pendingFilters);
  };

  const handleResetFilters = () => {
    if (academicData && academicData.courses.length > 0) {
      const resetFilters: FilterState = {
        semester: 1,
        course: academicData.courses[0].code,
        testType: "FORTNIGHTLY_TEST",
        testNumber: "1"
      };
      setPendingFilters(resetFilters);
    }
  };

  // Utility functions
  const getAvailableSemesters = () => {
    if (!studentProfile) return [1];
    const semesters = [];
    for (let i = 1; i <= studentProfile.semesterNo; i++) {
      semesters.push(i);
    }
    return semesters;
  };

  const getCoursesForSemester = (semester: number) => {
    if (!academicData) return [];
    return academicData.courses.filter(course => {
      const semesterPart = course.code.slice(-2);
      if (semesterPart.startsWith("S")) {
        const semesterNumber = parseInt(semesterPart.substring(1));
        return semesterNumber === semester;
      }
      return false;
    });
  };

  const getTestTypes = () => {
    return [
      { value: "FORTNIGHTLY_TEST", label: "Fortnightly Test" },
      { value: "ASSIGNMENT", label: "Assignment" },
      { value: "MID_SEM", label: "Mid Semester" },
      { value: "END_SEM", label: "End Semester" },
      { value: "INTERVIEW", label: "Interview" }
    ];
  };

  const getTestNumbers = () => {
    const numbers = [];
    const maxTests = pendingFilters.testType === "FORTNIGHTLY_TEST" ? 12 : 
                    pendingFilters.testType === "ASSIGNMENT" ? 5 : 
                    pendingFilters.testType === "INTERVIEW" ? 4 : 2;
    
    for (let i = 1; i <= maxTests; i++) {
      numbers.push(i.toString());
    }
    return numbers;
  };

  const getTestTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "FORTNIGHTLY_TEST": "Fortnightly Tests",
      "ASSIGNMENT": "Assignments", 
      "MID_SEM": "Mid Semester Exams",
      "END_SEM": "End Semester Exams",
      "INTERVIEW": "Interviews"
    };
    return typeMap[type] || type;
  };

  const getChartData = () => {
    if (!courseScores.length) return [];
    
    return courseScores.map((score, index) => ({
      test: `Test ${index + 1}`,
      percentage: Math.round((score.marksObtained / score.totalObtained) * 100),
      marks: score.marksObtained,
      maxMarks: score.totalObtained,
    }));
  };

  const getLeaderboardData = (type: "class" | "overall") => {
    const data = type === "class" ? batchLeaderboard : departmentLeaderboard;
    return data.map(student => ({
      rank: student.rank,
      name: student.id === studentProfile?.id ? "You" : student.name,
      avatar: student.id === studentProfile?.id ? "Y" : student.name.charAt(0),
      marks: student.totalMarks,
      percentage: Math.round((student.totalMarks / 100) * 100),
      isCurrentUser: student.id === studentProfile?.id,
      location: type === "class" ? 
        `Batch ${studentProfile?.batch.name}` : 
        `Department ${studentProfile?.department.name}`,
    }));
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">
        #{rank}
      </span>
    );
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-blue-500";
  };

  const getSemesterFromCode = (code: string): number => {
    const semesterPart = code.slice(-2);
    if (semesterPart.startsWith("S")) {
      const semesterNumber = parseInt(semesterPart.substring(1));
      return isNaN(semesterNumber) ? 0 : semesterNumber;
    }
    return 0;
  };

  const getOngoingCourses = () => {
    if (!academicData || !studentProfile) return [];
    return academicData.courses.filter(
      course => getSemesterFromCode(course.code) === studentProfile.semesterNo
    );
  };

  const getCompletedCourses = () => {
    if (!academicData || !studentProfile) return [];
    return academicData.courses.filter(
      course => getSemesterFromCode(course.code) < studentProfile.semesterNo
    );
  };

  const getUniqueSemesters = () => {
    const completedCourses = getCompletedCourses();
    const semesters = new Set<number>();
    completedCourses.forEach(course => {
      const semester = getSemesterFromCode(course.code);
      if (semester > 0) semesters.add(semester);
    });
    return Array.from(semesters).sort((a, b) => a - b);
  };

  const getFilteredCompletedCourses = () => {
    const completed = getCompletedCourses();
    if (semesterFilter === "all") return completed;
    return completed.filter(
      course => getSemesterFromCode(course.code) === semesterFilter
    );
  };

  const LeaderboardTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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

  const retryFetch = (type: keyof ErrorState) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    
    if (type === 'profile' || type === 'academics') {
      fetchInitialData(token);
    } else {
      fetchPerformanceData(token, activeFilters);
    }
  };

  // Auto-update course when semester changes
  useEffect(() => {
    const courses = getCoursesForSemester(pendingFilters.semester);
    if (courses.length > 0 && !courses.find(c => c.code === pendingFilters.course)) {
      setPendingFilters(prev => ({ ...prev, course: courses[0].code }));
    }
  }, [pendingFilters.semester]);

  // Error component
  const ErrorMessage: React.FC<{ 
    message: string; 
    onRetry?: () => void; 
    className?: string 
  }> = ({ message, onRetry, className = "" }) => (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 text-sm font-medium">Error</p>
          <p className="text-red-700 text-sm mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Loading component
  const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`flex items-center justify-center ${className}`}>
      <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
    </div>
  );

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

  // Handle critical errors (profile or academics data not available)
  if (errors.profile || errors.academics) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Academics & Performance
          </h2>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="max-w-md w-full">
            <ErrorMessage
              message={errors.profile || errors.academics || "Failed to load essential data"}
              onRetry={() => {
                const token = localStorage.getItem("authToken");
                if (token) fetchInitialData(token);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!studentProfile || !academicData) {
    return <AcademicsShimmer />;
  }

  const ongoingCourses = getOngoingCourses();
  const availableCourses = getCoursesForSemester(pendingFilters.semester);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Academics & Performance
        </h2>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">Batch</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {studentProfile.batch.name}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">Current Semester</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              {studentProfile.semesterNo}th
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-sm font-medium text-gray-600">Active Courses</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-2xl font-bold text-gray-800">{ongoingCourses.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <div className="relative">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={pendingFilters.semester}
                onChange={(e) => setPendingFilters(prev => ({ 
                  ...prev, 
                  semester: parseInt(e.target.value) 
                }))}
                disabled={loadingStates.updating}
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
            <div className="relative">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={pendingFilters.course}
                onChange={(e) => setPendingFilters(prev => ({ 
                  ...prev, 
                  course: e.target.value 
                }))}
                disabled={availableCourses.length === 0 || loadingStates.updating}
              >
                {availableCourses.length === 0 ? (
                  <option value="">No courses available</option>
                ) : (
                  availableCourses.map((course) => (
                    <option key={course.id} value={course.code}>
                      {course.code.toUpperCase()}
                    </option>
                  ))
                )}
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
                value={pendingFilters.testType}
                onChange={(e) => setPendingFilters(prev => ({ 
                  ...prev, 
                  testType: e.target.value 
                }))}
                disabled={loadingStates.updating}
              >
                {getTestTypes().map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
              Test Number
            </label>
            <div className="relative">
              <select
                className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={pendingFilters.testNumber}
                onChange={(e) => setPendingFilters(prev => ({ 
                  ...prev, 
                  testNumber: e.target.value 
                }))}
                disabled={loadingStates.updating}
              >
                {getTestNumbers().map((test) => (
                  <option key={test} value={test}>
                    Test {test}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Update and Reset Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdateFilters}
              disabled={!hasFiltersChanged() || loadingStates.updating || !pendingFilters.course}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                hasFiltersChanged() && pendingFilters.course && !loadingStates.updating
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loadingStates.updating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {loadingStates.updating ? 'Updating...' : 'Update Results'}
            </button>

            <button
              onClick={handleResetFilters}
              disabled={loadingStates.updating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {hasFiltersChanged() && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Click &quot;Update Results&quot; to apply changes.
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">
              {activeFilters.course.toUpperCase()} - {getTestTypeLabel(activeFilters.testType)} Performance
            </h4>
          </div>
          
          {errors.scores ? (
            <ErrorMessage
              message={errors.scores}
              onRetry={() => retryFetch('scores')}
              className="mb-4"
            />
          ) : loadingStates.scores ? (
            <LoadingSpinner className="h-64" />
          ) : getChartData().length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No performance data available for this selection</p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 15, right: 10, left: -30, bottom: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="test" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" />
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
          )}
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Leaderboard */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                Class Leaderboard - Test {activeFilters.testNumber}
              </h4>
              <button
                onClick={() => openLeaderboardModal("class")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
                // disabled={errors.batchLeaderboard || loadingStates.batchLeaderboard}
              >
                <div className="flex gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </div>
              </button>
            </div>

            {errors.batchLeaderboard ? (
              <ErrorMessage
                message={errors.batchLeaderboard}
                onRetry={() => retryFetch('batchLeaderboard')}
              />
            ) : loadingStates.batchLeaderboard ? (
              <LoadingSpinner className="h-32" />
            ) : getLeaderboardData("class").length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No leaderboard data available</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Overall Leaderboard */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                Overall Leaderboard - Test {activeFilters.testNumber}
              </h4>
              <button
                onClick={() => openLeaderboardModal("overall")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-[#D4E3F5] hover:bg-[#BBC9E7] text-[#1B3A6A] rounded-lg transition-colors duration-200 cursor-pointer ease-in-out"
                // disabled={errors.departmentLeaderboard || loadingStates.departmentLeaderboard}
              >
                <div className="flex gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View All</span>
                </div>
              </button>
            </div>

            {errors.departmentLeaderboard ? (
              <ErrorMessage
                message={errors.departmentLeaderboard}
                onRetry={() => retryFetch('departmentLeaderboard')}
              />
            ) : loadingStates.departmentLeaderboard ? (
              <LoadingSpinner className="h-32" />
            ) : getLeaderboardData("overall").length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No leaderboard data available</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* Ongoing Courses */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 overflow-hidden">
        <div className="bg-gray-200 px-6 py-4">
          <h4 className="font-semibold text-gray-900">
            Ongoing Courses - Semester {studentProfile.semesterNo}
          </h4>
        </div>
        <div className="p-6">
          {ongoingCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No ongoing courses found for current semester</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-700">Course</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Semester</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Credits</th>
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
          )}
        </div>
      </div>

      {/* Completed Courses */}
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
                  setSemesterFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))
                }
              >
                <option value="all">All Semesters</option>
                {getUniqueSemesters().map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
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
            {getFilteredCompletedCourses().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No completed courses found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold text-gray-700">Course</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Semester</th>
                      <th className="text-left py-3 font-semibold text-gray-700">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredCompletedCourses().map((course, index) => (
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
            )}
          </div>
        )}
      </div>

      {/* Leaderboard Modal */}
      {isLeaderboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {leaderboardType === "class" ? "Class" : "Overall"} Leaderboard
                - Test {activeFilters.testNumber}
              </h2>
              <button
                onClick={() => setIsLeaderboardModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 cursor-pointer" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {(leaderboardType === "class" ? errors.batchLeaderboard : errors.departmentLeaderboard) ? (
                <ErrorMessage
                  message={leaderboardType === "class" ? errors.batchLeaderboard! : errors.departmentLeaderboard!}
                  onRetry={() => retryFetch(leaderboardType === "class" ? 'batchLeaderboard' : 'departmentLeaderboard')}
                />
              ) : (leaderboardType === "class" ? loadingStates.batchLeaderboard : loadingStates.departmentLeaderboard) ? (
                <LoadingSpinner className="h-32" />
              ) : getLeaderboardData(leaderboardType).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No leaderboard data available</p>
                </div>
              ) : (
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
                        <p className="font-semibold text-gray-800">{student.name}</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {student.location}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">{student.marks} marks</p>
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
