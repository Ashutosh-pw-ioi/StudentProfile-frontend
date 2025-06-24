'use client';

import React, { useState } from "react";
import { User, ArrowUpRight } from "lucide-react";

export default function StudentProfile() {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const studentData = {
    name: "John Doe",
    role: "Data Science Student",
    batch: "Batch 2024",
    center: "Bangalore",
    rollNo: "DS001",
    department: "SOT",
    semester: "4th Semester",
    gender: "Male",
    email: "john.doe@example.com",
    studentId: "IOI2024DS001",
    mobile: "+91 9876543210",
    centerCity: "Bengaluru",
    admissionDate: "Aug 15, 2022",
    coursesOpted: "4",
    expectedGraduation: "May 2025",
    cgpa: "8.5",
    attendance: "85%",
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Student Profile
        </h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {studentData.name}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm px-4 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full">
                    {studentData.batch}
                  </span>
                  <span className="text-sm px-4 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full">
                    {studentData.center}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Roll No.", "Department", "Ongoing Semester"].map((title, i) => (
          <div
            key={title}
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
          >
            <div className="text-center pb-2 pt-6">
              <h4 className="text-sm font-medium text-gray-600">{title}</h4>
            </div>
            <div className="text-center pt-0 pb-6">
              <p className="text-2xl font-bold text-gray-800">
                {
                  [
                    studentData.rollNo,
                    studentData.department,
                    studentData.semester,
                  ][i]
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              {[
                ["Gender", studentData.gender],
                ["Student ID", studentData.studentId],
                ["Center City", studentData.centerCity],
                ["Courses Opted", studentData.coursesOpted],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-600 text-sm uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-gray-800 font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                ["Email", studentData.email],
                ["Mobile", studentData.mobile],
                ["Admission Date", studentData.admissionDate],
                ["Expected Graduation", studentData.expectedGraduation],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-600 text-sm uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-gray-800 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-lg font-medium text-gray-600">CGPA</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-5xl font-bold text-green-500">
              {studentData.cgpa}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 relative">
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
            aria-label="View Attendance Details"
          >
            <ArrowUpRight className="w-5 h-5 cursor-pointer" />
          </button>
          <div className="text-center pb-2 pt-6">
            <h4 className="text-lg font-medium text-gray-600">Attendance %</h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-5xl font-bold text-blue-500">
              {studentData.attendance}
            </p>
          </div>
        </div>
      </div>

      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Course-wise Attendance
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                onClick={() => setShowAttendanceModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {[
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
              ].map(({ course, percent, present, total, absent }) => (
                <div
                  key={course}
                  className="bg-gray-50 rounded-xl p-6 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900">{course}</h4>
                    <span
                      className={`text-2xl font-bold ${
                        percent >= 75 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Present: {present}</span>
                    <span>Total: {total}</span>
                    <span>Absent: {absent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percent >= 75 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}