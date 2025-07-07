"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
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

interface Batch {
  batchId: string;
  batchName: string;
  students: Student[];
  teachers: Teacher[];
  departmentName?: string;
  centerName?: string;
}

interface DepartmentBatches {
  departmentName: string;
  batches: Batch[];
}

interface BatchData {
  center: string;
  departments: DepartmentBatches[];
}

interface FullBatchData {
  success: boolean;
  data: BatchData;
}

interface TableBatch {
  id: string;
  name: string;
  department: string;
  center: string;
  students: number;
  teachers: string;
  studentsFull: Student[];
  teachersFull: Teacher[];
}

const centers = ["Patna", "Bangalore", "Noida", "Indore", "Lucknow", "Pune"];

export default function BatchManagement() {
  const [batches, setBatches] = useState<TableBatch[]>([]);
  const [batchesFull, setBatchesFull] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [teachersModalOpen, setTeachersModalOpen] = useState(false);
  const [currentStudents, setCurrentStudents] = useState<Student[]>([]);
  const [currentTeachers, setCurrentTeachers] = useState<Teacher[]>([]);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    centerName: "",
    depName: "",
    batchName: "",
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

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      if (!token || !selectedCenter) return;

      const response = await axios.post<FullBatchData>(
        "http://localhost:8000/api/batch/all",
        { centerName: selectedCenter },
        { headers: { token } }
      );

      if (!response.data.success) {
        throw new Error("API returned unsuccessful response");
      }

      const data = response.data;
      const allBatches: Batch[] = [];

      data.data.departments.forEach((department) => {
        department.batches.forEach((batch) => {
          allBatches.push({
            ...batch,
            departmentName: department.departmentName,
            centerName: data.data.center,
          });
        });
      });

      setBatchesFull(allBatches);

      const transformedData: TableBatch[] = allBatches.map((batch) => ({
        id: batch.batchId,
        name: batch.batchName,
        department: batch.departmentName || "",
        center: batch.centerName || "",
        students: batch.students?.length || 0,
        teachers:
          batch.teachers?.length > 0
            ? batch.teachers.length.toString()
            : "No teachers",
        teachersFull: batch.teachers || [],
        studentsFull: batch.students || [],
      }));

      setBatches(transformedData);
    } catch (error: any) {
      console.error("Error fetching batches:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load batches";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedCenter, router]);

  useEffect(() => {
    if (selectedCenter) {
      fetchBatches();
    }
  }, [fetchBatches, refreshTrigger, selectedCenter]);

  const handleUpdateBatch = (updatedItem: any) => {
    const batchItem = updatedItem as TableBatch;

    const updateBatch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login/admin");
          return;
        }

        const updateData = {
          batchId: batchItem.id,
          batchName: batchItem.name,
        };

        const response = await axios.put(
          "http://localhost:8000/api/batch/update",
          updateData,
          { headers: { token } }
        );

        if (response.status === 200) {
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error updating batch:", error);

        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/auth/login/admin");
          return;
        }

        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Failed to update batch";
        setError(errorMessage);
      }
    };

    updateBatch();
  };

  const handleDeleteBatch = (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;

    if (!window.confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    const deleteBatch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login/admin");
          return;
        }

        const response = await axios.delete(
          "http://localhost:8000/api/batch/delete",
          {
            headers: { token },
            data: { batchId: deleteId },
          }
        );

        if (response.status === 200) {
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error deleting batch:", error);

        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/auth/login/admin");
          return;
        }

        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Failed to delete batch";
        setError(errorMessage);
      }
    };

    deleteBatch();
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

    if (!formData.depName.trim()) {
      errors.depName = "Department is required";
    }

    if (!formData.batchName.trim()) {
      errors.batchName = "Batch name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setFormErrors({});

      const token = localStorage.getItem("authToken");
      if (!token) return;

      const payload = {
        centerName: selectedCenter,
        depName: formData.depName,
        batchName: formData.batchName,
      };

      await axios.post("http://localhost:8000/api/batch/create", payload, {
        headers: { token },
      });

      setIsAddBatchModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      setFormData({
        centerName: selectedCenter,
        depName: "",
        batchName: "",
      });
    } catch (error: any) {
      console.error("Error creating batch:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create batch";
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

  const handleOpenAddModal = () => {
    setFormData({
      centerName: selectedCenter,
      depName: "",
      batchName: "",
    });
    setFormErrors({});
    setIsAddBatchModalOpen(true);
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
            {currentStudents.length > 0 ? (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
            ) : (
              <p className="text-gray-500 text-center py-4">
                No students found in this batch.
              </p>
            )}
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
            {currentTeachers.length > 0 ? (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
            ) : (
              <p className="text-gray-500 text-center py-4">
                No teachers assigned to this batch.
              </p>
            )}
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

      {/* Add Batch Modal */}
      {isAddBatchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Add New Batch
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
                    name="depName"
                    value={formData.depName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.depName ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="SOT">School of Technology (SOT)</option>
                    <option value="SOM">School of Management (SOM)</option>
                    <option value="SOH">School of Humanities (SOH)</option>
                  </select>
                  {formErrors.depName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.depName}
                    </p>
                  )}
                </div>

                {/* Batch Name */}
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
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddBatchModalOpen(false)}
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
                    "Create Batch"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header with Center Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Batch Management
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

      {/* Stats and Add Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Batches</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {batches.length}
            </p>
          </div>
        </div>

        {/* Add Batch Button */}
        <div className="bg-white/80 shadow-lg rounded-lg flex items-center justify-center p-6">
          <button
            onClick={handleOpenAddModal}
            className="flex flex-col items-center justify-center w-full h-full text-[#1B3A6A] hover:text-[#122A4E] transition-colors"
          >
            <div className="bg-gray-200 rounded-full p-3 mb-2">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold">Add New Batch</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new batch record
            </p>
          </button>
        </div>
      </div>

      {/* Batches Table */}
      <Table
        data={batches}
        title="Batches Overview"
        filterField="department"
        badgeFields={["department"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
        }}
        nonEditableFields={["id", "center", "students", "teachers"]}
        onEdit={handleUpdateBatch}
        onDelete={handleDeleteBatch}
        hiddenColumns={["id", "teachersFull", "studentsFull"]}
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
