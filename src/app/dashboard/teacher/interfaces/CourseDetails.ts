export interface CourseDetail {
  id: string;
  name: string;
  code: string;
  credits: number;
  studentsCount: number;
  semester: number;
  batch: string;
  department: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  gender: string;
  phoneNumber: string;
  semesterNo?: number;
  center?: { name: string };
  department?: { name: string };
  batch?: { name: string };
}

export interface Batch {
  batchName: string;
  semester: number;
  courseCode: string;
  courseName: string;
  admittedStudentsCount: number;
  admittedStudents: Student[];
}
