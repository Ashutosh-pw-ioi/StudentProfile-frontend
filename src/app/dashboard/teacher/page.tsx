"use client";

import React, { useState } from "react";
import { User, ArrowUpRight, X, BookOpen, Users } from "lucide-react";

export default function StudentProfile() {
  const [showActiveCourses, setShowActiveCourses] = useState(false);

  const teacherData = {
    name: "Dr. Ananya Sharma",
    role: "Assistant Professor - Data Science",
    department: "SOT",
    employeeId: "EMP2024DS015",
    center: "Bangalore",
    centerCity: "Bengaluru",
    email: "ananya.sharma@example.com",
    mobile: "+91 9123456780",
    gender: "Female",
    qualification: "Ph.D. in Machine Learning",
    joiningDate: "July 10, 2018",
    experience: "6 years",
    subjectsHandled: "Data Mining, Machine Learning, Python",
    researchPapers: "12",
    currentSemesterCourses: "3",
    officeRoom: "Room 205, Block B",
    availability: "Mon-Fri, 9 AM - 5 PM",
    totalStudents: 300,
    activeCourses: [
      {
        id: 1,
        courseName: "Data Mining and Warehousing",
        courseCode: "CSE401",
        batch: "23B1",
        semester: "7th Semester",
        students: 120,
      },
      {
        id: 2,
        courseName: "Machine Learning Fundamentals",
        courseCode: "CSE502",
        batch: "24B1",
        semester: "8th Semester",
        students: 95,
      },
      {
        id: 3,
        courseName: "Python for Data Science",
        courseCode: "CSE303",
        batch: "25B1",
        semester: "6th Semester",
        students: 85,
      },
    ],
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Teacher Profile
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
                  {teacherData.name}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm px-4 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full">
                    {teacherData.center}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Employee ID", "Department", "Experience"].map((title, i) => (
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
                    teacherData.employeeId,
                    teacherData.department,
                    teacherData.experience,
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
                ["Gender", teacherData.gender],
                ["Email", teacherData.email],
                ["Center City", teacherData.centerCity],
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
                ["Email", teacherData.email],
                ["Mobile", teacherData.mobile],
                ["Office Room", teacherData.officeRoom],
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
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 relative">
          <button
            onClick={() => setShowActiveCourses(true)}
            className="absolute top-4 right-4 text-[#1B3A6A] cursor-pointer"
            aria-label="View Active Courses"
          >
            <ArrowUpRight className="w-5 h-5 cursor-pointer" />
          </button>
          <div className="text-center pb-2 pt-6">
            <h4 className="text-lg font-medium text-[#1B3A6A]">
              Active Courses
            </h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {teacherData.currentSemesterCourses}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 relative">
          <div className="text-center pb-2 pt-6">
            <h4 className="text-lg font-medium text-gray-600">
              Total Students
            </h4>
          </div>
          <div className="text-center pt-0 pb-6">
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {teacherData.totalStudents}
            </p>
          </div>
        </div>
      </div>

      {showActiveCourses && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#1B3A6A]" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Active Courses
                </h3>
              </div>
              <button
                onClick={() => setShowActiveCourses(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer ease-in-out"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-4">
                {teacherData.activeCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-[#FFD990] rounded-lg p-6 border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-xl font-bold text-gray-800">
                            {course.courseName}
                          </h4>
                          <span className="text-sm px-3 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full font-medium">
                            {course.courseCode}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#1B3A6A]">
                                Batch:
                              </span>
                              <span className="text-sm text-gray-800">
                                {course.batch}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#1B3A6A]">
                                Schedule:
                              </span>
                              <span className="text-sm text-gray-800">
                                {course.semester}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col items-end justify-center">
                          <Users className="w-4 h-4 text-[#1B3A6A]" />
                          <div className="text-sm font-medium text-gray-600">
                            Students
                          </div>
                          <div className="text-3xl font-bold text-[#1B3A6A]">
                            {course.students}
                          </div>
                        </div>
                      </div>
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
