"use client";

import React, { useState } from "react";
import { X, Edit, Trash2 } from "lucide-react";

interface Score {
  scoreId: string;
  marksObtained: number;
  totalObtained: number;
  dateOfExam: string;
  name: string;
  scoreType: string;
}

interface Student {
  studentId: string;
  studentName: string;
  email: string;
  enrollmentNumber: string;
  department: string;
  center: string;
  batch: string;
  scores: Score[];
}

interface Course {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  teachers: {
    id: string;
    name: string;
    email: string;
  }[];
  students: Student[];
}

interface StudentScoresModalProps {
  course: Course;
  onClose: () => void;
  onUpdateScore: (score: any) => void;
  onDeleteScore: (id: string) => void;
}

export default function StudentScoresModal({
  course,
  onClose,
  onUpdateScore,
  onDeleteScore
}: StudentScoresModalProps) {
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = (score: Score) => {
    setEditingScore({ ...score });
    setEditMode(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;
    
    onUpdateScore(editingScore);
    setEditMode(false);
    setEditingScore(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingScore) return;

    const { name, value } = e.target;
    setEditingScore({
      ...editingScore,
      [name]: name === 'marksObtained' || name === 'totalObtained' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {course.courseName} ({course.courseCode}) - Student Scores
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Course:</span> {course.courseName} ({course.courseCode})
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Credits:</span> {course.credits}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Teachers:</span> {course.teachers.map(t => t.name).join(", ")}
          </p>
        </div>

        {editMode && editingScore && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-semibold mb-3">Edit Score</h4>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingScore.name || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score Type
                  </label>
                  <input
                    type="text"
                    name="scoreType"
                    value={editingScore.scoreType || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    name="marksObtained"
                    value={editingScore.marksObtained || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalObtained"
                    value={editingScore.totalObtained || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Exam
                  </label>
                  <input
                    type="date"
                    name="dateOfExam"
                    value={editingScore.dateOfExam ? editingScore.dateOfExam.split('T')[0] : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value).toISOString() : "";
                      setEditingScore({...editingScore, dateOfExam: date});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
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
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {course.students.map((student) => (
                student.scores.length > 0 ? (
                  student.scores.map((score, index) => (
                    <tr key={`${student.studentId}-${index}`}>
                      {index === 0 ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap" rowSpan={student.scores.length}>
                            <div className="text-sm font-medium text-gray-900">
                              {student.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={student.scores.length}>
                            {student.enrollmentNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={student.scores.length}>
                            {student.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={student.scores.length}>
                            {student.batch}
                          </td>
                        </>
                      ) : null}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score.scoreType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score.marksObtained} / {score.totalObtained}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(score.dateOfExam).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(score)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteScore(score.scoreId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={student.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.enrollmentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.batch}
                    </td>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No scores recorded
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}