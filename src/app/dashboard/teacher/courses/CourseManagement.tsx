"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Student {
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

interface Batch {
  batchName: string;
  semester: number;
  courseCode: string;
  courseName: string;
  admittedStudentsCount: number;
  admittedStudents: Student[];
}

const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto">
    <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["BATCH", "SEMESTER", "COURSE", "ADMITTED STUDENTS"].map((header) => (
              <th key={header} className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3].map((row) => (
            <tr key={row} className="hover:bg-gray-50">
              {[1, 2, 3, 4].map((cell) => (
                <td key={cell} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

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
        const response = await axios.get("http://localhost:8000/api/teacher/teacher-academics", {
          headers: { token },
        });
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

  if (loading) return <SkeletonLoader />;
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Course Management & Student Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Admitted Students</h2>
          <p className="text-4xl font-bold text-[#1B3A6A] ">{totalAdmitted}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Active Courses</h2>
          <p className="text-4xl font-bold text-[#1B3A6A]">{batches.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BATCH</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEMESTER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COURSE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADMITTED STUDENTS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batches.map((batch, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{batch.batchName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.semester}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.courseName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => openStudentModal(batch)} className="flex text-[#1B3A6A] font-medium cursor-pointer">
                    {batch.admittedStudentsCount} <ArrowUpRight className="ml-1 w-5 h-5" />
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
                  Student Profiles - {selectedBatch.courseName} ({selectedBatch.batchName})
                </h2>
                <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENROLLMENT NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROFILE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedBatch.admittedStudents.map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm">{student.enrollmentNumber}</td>
                      <td className="px-6 py-4 text-sm">{student.name}</td>
                      <td className="px-6 py-4 text-sm">{student.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => openProfileModal(student)}
                          className="flex items-center text-[#1B3A6A] font-medium cursor-pointer"
                        >
                          View Profile <ArrowUpRight className="ml-1 w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
                <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.name || "NA"}</h3>
                <p className="text-gray-600">Enrollment No: {selectedStudent.enrollmentNumber || "NA"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> {selectedStudent.email || "NA"}</p>
                    <p><span className="font-medium">Phone:</span> {selectedStudent.phoneNumber || "NA"}</p>
                    <p><span className="font-medium">Gender:</span> {selectedStudent.gender || "NA"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Academic Info</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Semester:</span> {selectedStudent.semesterNo || "NA"}</p>
                    <p><span className="font-medium">Batch:</span> {selectedStudent.batch?.name || "NA"}</p>
                    <p><span className="font-medium">Department:</span> {selectedStudent.department?.name || "NA"}</p>
                    <p><span className="font-medium">Center:</span> {selectedStudent.center?.name || "NA"}</p>
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