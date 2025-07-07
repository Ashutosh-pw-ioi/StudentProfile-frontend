"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CoursesSkeleton from "../Skeletons/Courses";
import StudentListModal from "../Modals/StudentListModal";
import StudentProfileModal from "../Modals/StudentProfileModal";
import { Student, Batch } from "../interfaces/CourseDetails";

export default function CourseManagement() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login/teacher");
          return;
        }
        const response = await axios.get(
          "http://localhost:8000/api/teacher/teacher-academics",
          {
            headers: { token },
          }
        );
        if (response.data.success && response.data.data) {
          setBatches(response.data.data);
        } else {
          setError("Failed to load course data");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const openStudentModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowStudentModal(true);
  };

  const openProfileModal = async (student: Student) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/teacher");
        return;
      }
      setLoading(true);
      setShowStudentModal(false);
      const res = await axios.get(
        `http://localhost:8000/api/teacher/student-profile/${student.id}`
      );

      console.log(res.data.data);

      if (res.data.success && res.data.data) {
        setSelectedStudent(res.data.data);
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch student profile", error);
      alert("Failed to fetch student profile.");
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setShowStudentModal(false);
    setShowProfileModal(false);
    setSelectedBatch(null);
    setSelectedStudent(null);
  };

  const totalAdmitted = batches.reduce(
    (sum, batch) => sum + (batch.admittedStudentsCount || 0),
    0
  );

  if (loading) return <CoursesSkeleton />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-4 rounded-lg max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
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
          <p className="text-4xl font-bold text-[#1B3A6A] ">{totalAdmitted}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Active Courses
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {batch.batchName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {batch.semester}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {batch.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openStudentModal(batch)}
                    className="flex text-[#1B3A6A] font-medium cursor-pointer"
                  >
                    {batch.admittedStudentsCount}{" "}
                    <ArrowUpRight className="ml-1 w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StudentListModal
        showModal={showStudentModal}
        selectedBatch={selectedBatch}
        onClose={closeModals}
        onViewProfile={openProfileModal}
      />

      <StudentProfileModal
        showModal={showProfileModal}
        selectedStudent={selectedStudent}
        onClose={closeModals}
      />
    </div>
  );
}
