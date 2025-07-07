interface AttendanceData {
  course: string;
  percent: number;
  present: number;
  total: number;
  absent: number;
}

const attendanceData: AttendanceData[] = [
  {
    course: "Data Structures & Algorithms",
    percent: 85,
    present: 34,
    total: 40,
    absent: 6,
  },
  {
    course: "Machine Learning",
    percent: 72,
    present: 26,
    total: 36,
    absent: 10,
  },
  {
    course: "Database Management",
    percent: 90,
    present: 27,
    total: 30,
    absent: 3,
  },
  {
    course: "Software Engineering",
    percent: 78,
    present: 25,
    total: 32,
    absent: 7,
  },
];

export default attendanceData;
