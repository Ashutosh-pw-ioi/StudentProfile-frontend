import React from "react";
import { X, BookOpen, Users } from "lucide-react";

import { CourseDetail } from "../interfaces/CourseDetails";

interface ActiveCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseDetail[];
}

export default function ActiveCoursesModal({
  isOpen,
  onClose,
  courses,
}: ActiveCoursesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#1B3A6A]" />
            <h3 className="text-2xl font-bold text-gray-800">Active Courses</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid gap-4">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="bg-[#FFD990] rounded-lg p-6 border hover:shadow-md transition-shadow -ml-2 md:ml-0"
            >
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-xl font-bold text-gray-800">
                      {course.name}
                    </h4>
                    <span className="text-sm px-3 py-1 bg-[#D4E3F5] text-[#1B3A6A] rounded-full font-medium">
                      {course.code}
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
                          Semester:
                        </span>
                        <span className="text-sm text-gray-800">
                          {course.semester}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <Users className="w-4 h-4 text-[#1B3A6A]" />
                    <div className="text-sm font-medium text-gray-600">
                      Students
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-[#1B3A6A]">
                    {course.studentsCount}
                  </div>
                </div>
              </div>
            </div>
          )) || <p className="text-center py-8">No active courses found</p>}
        </div>
      </div>
    </div>
  );
}
