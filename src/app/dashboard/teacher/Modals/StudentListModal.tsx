import { ArrowUpRight, X } from "lucide-react";
import { Student, Batch } from "../interfaces/CourseDetails";

interface StudentListModalProps {
  showModal: boolean;
  selectedBatch: Batch | null;
  onClose: () => void;
  onViewProfile: (student: Student) => void;
}

const StudentListModal: React.FC<StudentListModalProps> = ({
  showModal,
  selectedBatch,
  onClose,
  onViewProfile,
}) => {
  if (!showModal || !selectedBatch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Student Profiles - {selectedBatch.courseName} (
              {selectedBatch.batchName})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ENROLLMENT NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMAIL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PROFILE
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedBatch.admittedStudents.map((student, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">
                    {student.enrollmentNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">{student.name}</td>
                  <td className="px-6 py-4 text-sm">{student.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onViewProfile(student)}
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
  );
};

export default StudentListModal;
