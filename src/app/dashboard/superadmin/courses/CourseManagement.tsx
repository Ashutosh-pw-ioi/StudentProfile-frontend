"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, Users, Plus } from "lucide-react";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Course {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  semesterNo: number;
  batchName: string;
  depName: string;
  centerName: string;
  teachers: Teacher[];
  students: Student[];
}

interface DepartmentCourses {
  [department: string]: Course[];
}

interface CourseData {
  success: boolean;
  centerId: string;
  data: DepartmentCourses;
}

interface TableCourse {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  batch: string;
  department: string;
  center: string;
  teachers: string;
  students: number;
  teachersFull: Teacher[];
  studentsFull: Student[];
}

const centers = ["Patna", "Bangalore", "Noida", "Indore", "Lucknow", "Pune"];

export default function CourseManagement() {
  const [courses, setCourses] = useState<TableCourse[]>([]);
  const [coursesFull, setCoursesFull] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [teachersModalOpen, setTeachersModalOpen] = useState(false);
  const [currentStudents, setCurrentStudents] = useState<Student[]>([]);
  const [currentTeachers, setCurrentTeachers] = useState<Teacher[]>([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    centerName: "",
    departmentName: "",
    batchName: "",
    semesterNumber: "",
    name: "",
    code: "",
    credits: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/login/admin");
      return;
    }

    try {
      const userData = JSON.parse(user);
      setRole(userData.role);

      // Get center from localStorage
      const storedCenter = localStorage.getItem("selectedCenter") || centers[0];
      setSelectedCenter(storedCenter);
      setFormData((prev) => ({
        ...prev,
        centerName: storedCenter,
      }));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login/admin");
    }
  }, [router]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token || !selectedCenter) return;

      const response = await axios.post<CourseData>(
        "http://localhost:8000/api/course/all",
        { centerName: selectedCenter },
        { headers: { token } }
      );

      const data = response.data;
      const allCourses: Course[] = [];
      Object.values(data.data).forEach((departmentCourses) => {
        allCourses.push(...departmentCourses);
      });

      setCoursesFull(allCourses);

      const transformedData = allCourses.map((course) => ({
        id: course.courseId,
        name: course.courseName,
        code: course.courseCode,
        credits: course.credits,
        semester: course.semesterNo,
        batch: course.batchName,
        department: course.depName,
        center: course.centerName,
        teachers: course.teachers.map((t) => t.name).join(", "),
        students: course.students.length,
        teachersFull: course.teachers,
        studentsFull: course.students,
      }));

      setCourses(transformedData);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedCenter) {
      fetchCourses();
    }
  }, [fetchCourses, refreshTrigger, selectedCenter]);

  const handleUpdateCourse = async (updatedItem: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const originalCourse = coursesFull.find(
        (c) => c.courseId === updatedItem.id
      );
      if (!originalCourse) return;

      const updateData = {
        id: updatedItem.id,
        name: updatedItem.name,
        code: updatedItem.code,
        credits: updatedItem.credits,
        semester: updatedItem.semester,
        batch: updatedItem.batch,
        department: updatedItem.department,
        center: updatedItem.center,
      };

      await axios.put("http://localhost:8000/api/course/update", updateData, {
        headers: { token },
      });

      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error updating course:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update course"
      );
    }
  };

  const handleDeleteCourse = async (id: string | number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const courseId = typeof id === "number" ? id.toString() : id;

      await axios.delete("http://localhost:8000/api/course/delete", {
        headers: { token },
        data: { id: courseId },
      });

      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error deleting course:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
        return;
      }
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete course"
      );
    }
  };

  const openStudentsModal = (students: Student[]) => {
    setCurrentStudents(students);
    setStudentsModalOpen(true);
  };

  const openTeachersModal = (teachers: Teacher[]) => {
    setCurrentTeachers(teachers);
    setTeachersModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      "departmentName",
      "batchName",
      "semesterNumber",
      "name",
      "code",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = "This field is required";
      }
    });

    if (isNaN(Number(formData.semesterNumber))) {
      errors.semesterNumber = "Must be a number";
    }

    if (isNaN(Number(formData.credits))) {
      errors.credits = "Must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const payload = {
        ...formData,
        semesterNumber: Number(formData.semesterNumber),
        credits: Number(formData.credits),
      };

      const response = await axios.post(
        "http://localhost:8000/api/course/create",
        payload,
        { headers: { token } }
      );

      if (response.status === 201) {
        setIsAddCourseModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
        setFormData({
          centerName: selectedCenter,
          departmentName: "",
          batchName: "",
          semesterNumber: "",
          name: "",
          code: "",
          credits: "",
        });
      }
    } catch (error: any) {
      console.error("Error creating course:", error);
      let errorMessage = "Failed to create course";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const center = e.target.value;
    setSelectedCenter(center);
    localStorage.setItem("selectedCenter", center);
    setFormData((prev) => ({ ...prev, centerName: center }));
  };

  if (loading) {
    return <Shimmer />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
            setRefreshTrigger((prev) => prev + 1);
          }}
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Students Modal */}
      {studentsModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Students List
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Number
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.enrollmentNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStudentsModalOpen(false)}
                className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teachers Modal */}
      {teachersModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Teachers List
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setTeachersModalOpen(false)}
                className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add New Course
            </h3>

            {formErrors.submit && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Center Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center
                  </label>
                  <input
                    type="text"
                    value={selectedCenter}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.departmentName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="SOT">School of Technology (SOT)</option>
                    <option value="SOM">School of Management (SOM)</option>
                    <option value="SOH">School of HealthCare (SOH)</option>
                  </select>
                  {formErrors.departmentName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.departmentName}
                    </p>
                  )}
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    name="batchName"
                    value={formData.batchName}
                    onChange={handleInputChange}
                    placeholder="e.g., SOT24B1"
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.batchName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.batchName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.batchName}
                    </p>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester Number *
                  </label>
                  <input
                    type="number"
                    name="semesterNumber"
                    value={formData.semesterNumber}
                    onChange={handleInputChange}
                    min="1"
                    max="8"
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.semesterNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.semesterNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.semesterNumber}
                    </p>
                  )}
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., CS201"
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.code ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.code && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.code}
                    </p>
                  )}
                </div>

                {/* Credits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.credits ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.credits && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.credits}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3A6A] text-white rounded-md hover:bg-[#122A4E] flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="ttext-2xl sm:ext-3xl font-bold text-gray-800 mb-2">
          Course Management
        </h2>

        {role === "SUPER_ADMIN" && (
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Select Center:</label>
            <select
              value={selectedCenter}
              onChange={handleCenterChange}
              className="border border-gray-300 p-2 rounded-md"
            >
              {centers.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Courses</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {courses.length}
            </p>
          </div>
        </div>

        <div className="bg-white/80 shadow-lg rounded-lg flex items-center justify-center p-6">
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full text-[#1B3A6A] hover:text-[#122A4E] transition-colors"
          >
            <div className="bg-gray-200 rounded-full p-3 mb-2">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold">Add New Course</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new course record
            </p>
          </button>
        </div>
      </div>

      <Table
        data={courses}
        title="Courses Overview"
        filterField="department"
        badgeFields={["department", "batch"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
          batch: ["SOT25B1", "SOT25B2", "SOM25B1", "SOM25B2"],
        }}
        nonEditableFields={["id", "center"]}
        hiddenColumns={["id", "teachersFull", "studentsFull"]}
        onEdit={handleUpdateCourse}
        onDelete={handleDeleteCourse}
        customRenderers={{
          teachers: (item) => (
            <button
              onClick={() => openTeachersModal(item.teachersFull)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.teachers}
            </button>
          ),
          students: (item) => (
            <button
              onClick={() => openStudentsModal(item.studentsFull)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.students} students
            </button>
          ),
        }}
      />
    </div>
  );
}
