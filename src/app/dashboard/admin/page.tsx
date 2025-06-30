"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Filter, Trash2, Edit } from "lucide-react";
import UploadSection from "./UploadSection";
import { studentData } from "./studentsData";

export default function AdminProfile() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const [studentsData, setStudentsData] = useState(studentData);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const departments = ["All", "SOH", "SOM", "SOT"];

  const filteredStudents = studentsData.filter((student) => {
    const matchesDepartment =
      selectedDepartment === "All" || student.department === selectedDepartment;
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment]);

  const getDepartmentColor = (dept: any) => {
    switch (dept) {
      case "SOT":
        return "bg-blue-100 text-blue-800";
      case "SOM":
        return "bg-green-100 text-green-800";
      case "SOH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentFullName = (dept: any) => {
    switch (dept) {
      case "SOT":
        return "School of Technology";
      case "SOM":
        return "School of Management";
      case "SOH":
        return "School of Healthcare";
      default:
        return dept;
    }
  };

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      setStudentsData(
        studentsData.filter((student) => student.id !== studentToDelete)
      );
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleEditClick = (student: any) => {
    setEditingStudent(student);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentsData(
      studentsData.map((student) =>
        student.id === editingStudent.id ? editingStudent : student
      )
    );
    setEditModalOpen(false);
    setEditingStudent(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingStudent({
      ...editingStudent,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Students Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Students</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {studentsData.length}
            </p>
          </div>
        </div>
        <UploadSection />
      </div>

      <div className="bg-white/80 shadow-lg rounded-lg px-3">
        {/* Edit Modal */}
        {editModalOpen && editingStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4 shadow-2xl">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Edit Student
              </h3>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    name="name"
                    value={editingStudent.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="studentId"
                    value={editingStudent.studentId}
                    onChange={handleEditChange}
                    placeholder="Student ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editingStudent.email}
                    onChange={handleEditChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    name="department"
                    value={editingStudent.department}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="SOT">School of Technology</option>
                    <option value="SOM">School of Management</option>
                    <option value="SOH">School of Healthcare</option>
                  </select>
                  <input
                    type="number"
                    name="cgpa"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingStudent.cgpa}
                    onChange={handleEditChange}
                    placeholder="CGPA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4 shadow-2xl">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this student record? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-6 px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-4">
            <h4 className="text-xl font-bold text-gray-800">
              Students Overview
            </h4>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "All"
                        ? "All Departments"
                        : getDepartmentFullName(dept)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                    "Name",
                    "Student ID",
                    "Email",
                    "Batch",
                    "Semester",
                    "Department",
                    "CGPA",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="text-left py-3 px-4 font-semibold text-gray-700"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {student.studentId}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{student.email}</td>
                    <td className="py-3 px-4 text-gray-600">{student.batch}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {student.semester}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(
                          student.department
                        )}`}
                      >
                        {student.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {student.cgpa}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600 px-4">
            Showing {paginatedStudents.length} of {filteredStudents.length}{" "}
            students
            {selectedDepartment !== "All" &&
              ` in ${getDepartmentFullName(selectedDepartment)}`}
          </div>

          <div className="flex justify-between items-center mt-6 px-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer bg-[#1B3A6A] text-white duration-200 ease-in-out"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer bg-[#1B3A6A] text-white duration-200 ease-in-out"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
