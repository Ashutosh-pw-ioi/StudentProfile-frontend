"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, Plus } from "lucide-react";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios from "axios";
import Shimmer from "../Shimmer";
import StudentsModal from "./StudentsModal";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

interface AdminData {
  id: string;
  name: string;
  email: string;
  center: {
    id: string;
    name: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<TableCourse[]>([]);
  const [coursesFull, setCoursesFull] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [currentStudents, setCurrentStudents] = useState<Student[]>([]);
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
  const [userCenter, setUserCenter] = useState("");
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/login/admin");
      return;
    }

    try {
      const userData: User = JSON.parse(user);
      if (userData.role === "ADMIN" && userData.id) {
        setAdminId(userData.id);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login/admin");
    }
  }, [router]);

  const fetchAdminDetails = useCallback(async () => {
    if (!adminId) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post<{ success: boolean; data: AdminData }>(
        `${process.env.backendUrl}/api/admin/get`,
        { id: adminId },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        const adminData = response.data.data;
        setUserCenter(adminData.center.name);
        setFormData((prev) => ({
          ...prev,
          centerName: adminData.center.name,
        }));
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
      }
    }
  }, [adminId, router]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const response = await axios.get<CourseData>(
        `${process.env.backendUrl}/api/course/all`,
        { headers: { token } }
      );

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
        return;
      }

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
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchAdminDetails();
      fetchCourses();
    }
  }, [adminId, fetchAdminDetails, fetchCourses, refreshTrigger]);

  const handleUpdateCourse = async (updatedItem: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const originalCourse = coursesFull.find(
        (c) => c.courseId === updatedItem.id
      );
      if (!originalCourse) {
        throw new Error("Course not found");
      }

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

      await axios.put(`${process.env.backendUrl}/api/course/update`, updateData, {
        headers: { token },
      });

      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error updating course:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
        return;
      }
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

      await axios.delete(`${backendUrl}/api/course/delete`, {
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
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const payload = {
        ...formData,
        semesterNumber: Number(formData.semesterNumber),
        credits: Number(formData.credits),
        centerName: userCenter,
      };

      const response = await axios.post(
        `${backendUrl}/api/course/create`,
        payload,
        { headers: { token } }
      );

      if (response.status === 201) {
        setIsAddCourseModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
        setFormData({
          centerName: userCenter,
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
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E] cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Center
                    </label>
                    <input
                      type="text"
                      value={userCenter}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

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
                      <option value="SOH">School of Humanities (SOH)</option>
                    </select>
                    {formErrors.departmentName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.departmentName}
                      </p>
                    )}
                  </div>

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
                        formErrors.credits
                          ? "border-red-500"
                          : "border-gray-300"
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
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B3A6A] text-white rounded-md hover:bg-[#122A4E] flex items-center cursor-pointer"
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
        {studentsModalOpen && (
          <StudentsModal
            isOpen={studentsModalOpen}
            onClose={() => setStudentsModalOpen(false)}
            students={currentStudents}
          />
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Course Management
        </h2>
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
            className="flex flex-col items-center justify-center w-full h-full text-[#1B3A6A] hover:text-[#122A4E] transition-colors cursor-pointer"
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
        nonEditableFields={["id"]}
        hiddenColumns={["id", "teachersFull", "studentsFull"]}
        onEdit={handleUpdateCourse}
        onDelete={handleDeleteCourse}
        customRenderers={{
          students: (item) => (
            <button
              onClick={() => openStudentsModal(item.studentsFull)}
              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {item.students} students
            </button>
          ),
        }}
      />
    </div>
  );
}
