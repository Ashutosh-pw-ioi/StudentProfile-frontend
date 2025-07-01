"use client";

import React, { useState } from "react";
import { X, Edit, Trash2 } from "lucide-react";

interface StudentScoresModalProps {
  course: {
    courseId: string;
    courseName: string;
    courseCode: string;
    credits: number;
    teachers: {
      id: string;
      name: string;
      email: string;
    }[];
    students: {
      studentId: string;
      studentName: string;
      email: string;
      enrollmentNumber: string;
      department: string;
      center: string;
      batch: string;
      scores: any;
    }[];
  };
  student?: any;
  onClose: () => void;
  onUpdateScore: (score: any) => void;
  onDeleteScore: (id: string) => void;
}

export default function StudentScoresModal({
  course,
  student,
  onClose,
  onUpdateScore,
  onDeleteScore
}: StudentScoresModalProps) {
  const [editingScore, setEditingScore] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = (score: any) => {
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

  const studentsToShow = student ? [student] : course.students;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {student ? `${student.studentName}'s Scores` : `${course.courseName} (${course.courseCode}) - Students`}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        {editMode && editingScore ? (
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
        ) : null}

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
                {student && (
                  <>
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
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentsToShow.map((stud) => (
                <React.Fragment key={stud.studentId}>
                  {!student || !stud.scores ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {stud.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stud.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stud.enrollmentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stud.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stud.batch}
                      </td>
                      {student && (
                        <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No scores recorded yet
                        </td>
                      )}
                    </tr>
                  ) : (
                    <>
                      {student ? (
                        <tr key={stud.scores.scoreId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {stud.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stud.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.enrollmentNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.batch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.scores.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.scores.scoreType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.scores.marksObtained} / {stud.scores.totalObtained}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(stud.scores.dateOfExam).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditClick(stud.scores)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteScore(stud.scores.scoreId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={stud.studentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {stud.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stud.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.enrollmentNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.batch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stud.scores ? (
                              <button
                                onClick={() => handleEditClick(stud.scores)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Scores
                              </button>
                            ) : 'No scores'}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}