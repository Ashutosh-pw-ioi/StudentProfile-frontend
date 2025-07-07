import {
  Calendar,
  FolderOpen,
  Users,
  Trophy,
  Medal,
  Award,
} from "lucide-react";

export interface SemesterPerformance {
  semester: string;
  percentage: number;
  rank: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface BatchLeaderboardStudent {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  totalMarks: number;
  rank: number;
}

export interface DepartmentLeaderboardStudent {
  id: string;
  name: string;
  enrollmentNumber: string;
  semesterNo: number;
  center: {
    name: string;
  };
  totalMarks: number;
  rank: number;
}

export interface CategoryItem {
  name: string;
  score: number;
  total: number;
  percentage: number;
}

export interface CategoryData {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: CategoryItem[];
}

export interface Student {
  id: string;
  rank: number;
  name: string;
  percentage: number;
  avatar: string;
  location: string;
  isCurrentUser?: boolean;
}

export const generateAvatar = (name: string): string => {
  const names = name.split(" ");
  return names
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const getSemesterPerformance = (): SemesterPerformance[] => {
  return [
    { semester: "Sem 1", percentage: 90, rank: 25 },
    { semester: "Sem 2", percentage: 75, rank: 18 },
    { semester: "Sem 3", percentage: 80, rank: 16 },
    { semester: "Sem 4", percentage: 78, rank: 15 },
  ];
};

export const getBatchTopStudents = (
  batchLeaderboard: any,
  studentProfile: any
): Student[] => {
  if (!batchLeaderboard?.students) return [];

  const topStudents = batchLeaderboard.students
    .slice(0, 3)
    .map((student: BatchLeaderboardStudent) => ({
      id: student.id,
      rank: student.rank,
      name: student.name,
      percentage: student.totalMarks,
      avatar: generateAvatar(student.name),
      location: batchLeaderboard.center?.name || "Unknown",
      isCurrentUser: student.id === studentProfile?.id,
    }));

  const currentUser = batchLeaderboard.students.find(
    (s: BatchLeaderboardStudent) => s.id === studentProfile?.id
  );

  if (currentUser && !topStudents.some((s: any) => s.id === currentUser.id)) {
    topStudents.push({
      id: currentUser.id,
      rank: currentUser.rank,
      name: currentUser.name,
      percentage: currentUser.totalMarks,
      avatar: generateAvatar(currentUser.name),
      location: batchLeaderboard.center?.name || "Unknown",
      isCurrentUser: true,
    });
  }

  return topStudents;
};

export const getDepartmentTopStudents = (
  departmentLeaderboard: any,
  studentProfile: any
): Student[] => {
  if (!departmentLeaderboard?.students) return [];

  const topStudents = departmentLeaderboard.students
    .slice(0, 3)
    .map((student: DepartmentLeaderboardStudent) => ({
      id: student.id,
      rank: student.rank,
      name: student.name,
      percentage: student.totalMarks,
      avatar: generateAvatar(student.name),
      location: student.center?.name || "Unknown",
      isCurrentUser: student.id === studentProfile?.id,
    }));

  const currentUser = departmentLeaderboard.students.find(
    (s: DepartmentLeaderboardStudent) => s.id === studentProfile?.id
  );

  if (currentUser && !topStudents.some((s: any) => s.id === currentUser.id)) {
    topStudents.push({
      id: currentUser.id,
      rank: currentUser.rank,
      name: currentUser.name,
      percentage: currentUser.totalMarks,
      avatar: generateAvatar(currentUser.name),
      location: currentUser.center?.name || "Unknown",
      isCurrentUser: true,
    });
  }

  return topStudents;
};

export const getAllStudents = (
  leaderboardType: "batch" | "department",
  batchLeaderboard: any,
  departmentLeaderboard: any,
  studentProfile: any
): Student[] => {
  const students =
    leaderboardType === "batch"
      ? batchLeaderboard?.students
      : departmentLeaderboard?.students;

  if (!students) return [];

  return students.map((student: any) => ({
    id: student.id,
    rank: student.rank,
    name: student.name,
    percentage: student.totalMarks,
    avatar: generateAvatar(student.name),
    location:
      leaderboardType === "batch"
        ? batchLeaderboard.center?.name || "Unknown"
        : student.center?.name || "Unknown",
    isCurrentUser: student.id === studentProfile?.id,
  }));
};

export const getRankIcon = (rank: number) => {
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

export const getRankColor = (rank: number) => {
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

export const getSemesterFromCode = (code: string): number => {
  const semesterPart = code.slice(-2);
  if (semesterPart.startsWith("S")) {
    const semesterNumber = parseInt(semesterPart.substring(1));
    return isNaN(semesterNumber) ? 0 : semesterNumber;
  }
  return 0;
};

export const getOngoingCourses = (
  academicsData: any,
  studentProfile: any
): Course[] => {
  if (!academicsData?.courses) return [];
  const currentSemester = studentProfile?.semesterNo || 0;
  return academicsData.courses.filter(
    (course: any) => getSemesterFromCode(course.code) === currentSemester
  );
};

export const getCompletedCourses = (
  academicsData: any,
  studentProfile: any
): Course[] => {
  if (!academicsData?.courses) return [];
  const currentSemester = studentProfile?.semesterNo || 0;
  return academicsData.courses.filter(
    (course: any) => getSemesterFromCode(course.code) < currentSemester
  );
};

export const getUniqueSemesters = (
  academicsData: any,
  studentProfile: any
): number[] => {
  const completedCourses = getCompletedCourses(academicsData, studentProfile);
  const semesters = new Set<number>();
  completedCourses.forEach((course: Course) => {
    const semester = getSemesterFromCode(course.code);
    if (semester > 0) semesters.add(semester);
  });
  return Array.from(semesters).sort((a, b) => a - b);
};

export const getFilteredCompletedCourses = (
  academicsData: any,
  studentProfile: any,
  semesterFilter: number | "all"
): Course[] => {
  const completedCourses = getCompletedCourses(academicsData, studentProfile);
  if (semesterFilter === "all") return completedCourses;
  return completedCourses.filter(
    (course: Course) => getSemesterFromCode(course.code) === semesterFilter
  );
};

export const getCategoryData = (): Record<string, CategoryData> => {
  return {
    "Fortnightly Tests": {
      icon: Calendar,
      color: "blue",
      data: [
        { name: "Test 1 - Fundamentals", score: 18, total: 20, percentage: 90 },
        {
          name: "Test 2 - Advanced Topics",
          score: 16,
          total: 20,
          percentage: 80,
        },
        {
          name: "Test 3 - Practical Applications",
          score: 19,
          total: 20,
          percentage: 95,
        },
        {
          name: "Test 4 - Comprehensive Review",
          score: 17,
          total: 20,
          percentage: 85,
        },
      ],
    },
    Projects: {
      icon: FolderOpen,
      color: "green",
      data: [
        {
          name: "Mini Project - Data Visualization",
          score: 47,
          total: 50,
          percentage: 94,
        },
        {
          name: "Group Project - ML Implementation",
          score: 45,
          total: 50,
          percentage: 90,
        },
        {
          name: "Final Project - Complete Solution",
          score: 48,
          total: 50,
          percentage: 96,
        },
        {
          name: "Research Project - Innovation",
          score: 46,
          total: 50,
          percentage: 92,
        },
      ],
    },
    Interviews: {
      icon: Users,
      color: "purple",
      data: [
        {
          name: "Technical Interview - Round 1",
          score: 28,
          total: 30,
          percentage: 93,
        },
        {
          name: "Technical Interview - Round 2",
          score: 26,
          total: 30,
          percentage: 87,
        },
        { name: "Behavioral Interview", score: 29, total: 30, percentage: 97 },
        {
          name: "Final Assessment Interview",
          score: 27,
          total: 30,
          percentage: 90,
        },
      ],
    },
  };
};
