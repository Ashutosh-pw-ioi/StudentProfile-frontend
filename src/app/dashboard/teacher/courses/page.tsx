// app/courses/page.tsx
"use client";

import { ArrowUp, ArrowUpRight, X } from "lucide-react";
import React, { useState } from "react";

type Student = {
  id: string;
  batch: string;
  name: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  currentSemester: number;
  cgpa: number;
  attendance: number;
  status: string;
  assignmentScore: number;
  participationScore: number;
  overallGrade: string;
};

type Batch = {
  batch: string;
  semester: number;
  course: string;
  admittedStudents: number;
};

const batches: Batch[] = [
  { batch: "SOT2481", semester: 1, course: "DSA", admittedStudents: 132 },
  {
    batch: "SOT2482",
    semester: 2,
    course: "Mathematics",
    admittedStudents: 137,
  },
  { batch: "SOT2482", semester: 2, course: "WebDev", admittedStudents: 137 },
  { batch: "SOT2482", semester: 2, course: "Java", admittedStudents: 137 },
];

const students: Student[] = [
  {
    id: "2301100042",
    batch: "SOT2481",
    name: "Ram Charan",
    email: "ram.charan@student.ioi.edu",
    mobile: "+91 98765-43210",
    gender: "Male",
    dob: "15/08/2003",
    currentSemester: 2,
    cgpa: 8.5,
    attendance: 92,
    status: "Active",
    assignmentScore: 85,
    participationScore: 78,
    overallGrade: "A-",
  },
  {
    id: "2301100043",
    batch: "SOT2481",
    name: "Sneha Reddy",
    email: "sneha.reddy@student.ioi.edu",
    mobile: "+91 98765-43211",
    gender: "Female",
    dob: "22/11/2003",
    currentSemester: 2,
    cgpa: 9.1,
    attendance: 95,
    status: "Active",
    assignmentScore: 90,
    participationScore: 82,
    overallGrade: "A",
  },
  {
    id: "2301100044",
    batch: "SOT2481",
    name: "Arjun Mehta",
    email: "arjun.mehta@student.ioi.edu",
    mobile: "+91 98765-43212",
    gender: "Male",
    dob: "09/01/2004",
    currentSemester: 2,
    cgpa: 7.8,
    attendance: 88,
    status: "Active",
    assignmentScore: 75,
    participationScore: 70,
    overallGrade: "B+",
  },
  {
    id: "2301100045",
    batch: "SOT2481",
    name: "Divya Kapoor",
    email: "divya.kapoor@student.ioi.edu",
    mobile: "+91 98765-43213",
    gender: "Female",
    dob: "17/03/2003",
    currentSemester: 2,
    cgpa: 8.9,
    attendance: 90,
    status: "Active",
    assignmentScore: 88,
    participationScore: 85,
    overallGrade: "A",
  },
  {
    id: "2301100046",
    batch: "SOT2481",
    name: "Ravi Kumar",
    email: "ravi.kumar@student.ioi.edu",
    mobile: "+91 98765-43214",
    gender: "Male",
    dob: "02/07/2003",
    currentSemester: 2,
    cgpa: 6.5,
    attendance: 80,
    status: "Active",
    assignmentScore: 60,
    participationScore: 55,
    overallGrade: "C+",
  },
  {
    id: "2301100047",
    batch: "SOT2481",
    name: "Pooja Sharma",
    email: "pooja.sharma@student.ioi.edu",
    mobile: "+91 98765-43215",
    gender: "Female",
    dob: "12/10/2003",
    currentSemester: 2,
    cgpa: 8.3,
    attendance: 89,
    status: "Active",
    assignmentScore: 82,
    participationScore: 79,
    overallGrade: "A-",
  },
  {
    id: "2301100048",
    batch: "SOT2481",
    name: "Mohit Verma",
    email: "mohit.verma@student.ioi.edu",
    mobile: "+91 98765-43216",
    gender: "Male",
    dob: "26/06/2004",
    currentSemester: 2,
    cgpa: 7.1,
    attendance: 85,
    status: "Active",
    assignmentScore: 70,
    participationScore: 68,
    overallGrade: "B",
  },
  {
    id: "2301100049",
    batch: "SOT2481",
    name: "Ananya Singh",
    email: "ananya.singh@student.ioi.edu",
    mobile: "+91 98765-43217",
    gender: "Female",
    dob: "05/05/2004",
    currentSemester: 2,
    cgpa: 9.3,
    attendance: 97,
    status: "Active",
    assignmentScore: 94,
    participationScore: 90,
    overallGrade: "A+",
  },
  {
    id: "2301100050",
    batch: "SOT2481",
    name: "Karan Johar",
    email: "karan.johar@student.ioi.edu",
    mobile: "+91 98765-43218",
    gender: "Male",
    dob: "11/02/2003",
    currentSemester: 2,
    cgpa: 7.9,
    attendance: 87,
    status: "Active",
    assignmentScore: 76,
    participationScore: 80,
    overallGrade: "B+",
  },
  {
    id: "2301100051",
    batch: "SOT2481",
    name: "Meera Iyer",
    email: "meera.iyer@student.ioi.edu",
    mobile: "+91 98765-43219",
    gender: "Female",
    dob: "19/09/2003",
    currentSemester: 2,
    cgpa: 8.7,
    attendance: 91,
    status: "Active",
    assignmentScore: 86,
    participationScore: 84,
    overallGrade: "A",
  },
];

export default function CourseManagement() {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const openStudentModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowStudentModal(true);
  };

  const openProfileModal = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(false);
    setShowProfileModal(true);
  };

  const closeModals = () => {
    setShowStudentModal(false);
    setShowProfileModal(false);
    setSelectedBatch(null);
    setSelectedStudent(null);
  };

  const totalAdmitted = batches.reduce(
    (sum, batch) => sum + batch.admittedStudents,
    0
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Course Management & Student Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Admitted Students
          </h2>
          <p className="text-4xl font-bold text-[#1B3A6A]">{totalAdmitted}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Active Course
          </h2>
          <p className="text-4xl font-bold text-[#1B3A6A]">{batches.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                BATCH
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SEMESTER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                COURSE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ADMITTED STUDENTS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batches.map((batch, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {batch.batch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {batch.semester}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {batch.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => openStudentModal(batch)}
                    className="flex text-[#1B3A6A] font-medium cursor-pointer text-md"
                  >
                    {batch.admittedStudents}
                    <ArrowUpRight className="font-medium ml-1 w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showStudentModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Student Profiles - {selectedBatch.course} (
                  {selectedBatch.batch})
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STUDENT ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BATCH
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STUDENT NAME
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PROFILE
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students
                      .filter(
                        (student) => student.batch === selectedBatch.batch
                      )
                      .map((student, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.batch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => openProfileModal(student)}
                              className="flex items-center text-[#1B3A6A] font-medium cursor-pointer"
                            >
                              View Profile{" "}
                              <ArrowUpRight className="font-medium h-5 w-5 ml-1" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Student Profile
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 pb-4 border-b">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedStudent.name}
                </h3>
                <p className="text-gray-600">
                  Student ID: {selectedStudent.id}
                </p>
                <p className="text-gray-600">Batch: {selectedStudent.batch}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedStudent.email}
                    </p>
                    <p>
                      <span className="font-medium">Mobile:</span>{" "}
                      {selectedStudent.mobile}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {selectedStudent.gender}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Academic Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Current Semester:</span>{" "}
                      {selectedStudent.currentSemester}nd
                    </p>
                    <p>
                      <span className="font-medium">CGPA:</span>{" "}
                      {selectedStudent.cgpa}
                    </p>
                    <p>
                      <span className="font-medium">Attendance:</span>{" "}
                      {selectedStudent.attendance}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 -mt-2">
                  Current Course Performance
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-[#1B3A6A]">
                      {selectedStudent.assignmentScore}%
                    </p>
                    <p className="text-gray-600">Assignments</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-[#1B3A6A]">
                      {selectedStudent.attendance}%
                    </p>
                    <p className="text-gray-600">Attendance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
