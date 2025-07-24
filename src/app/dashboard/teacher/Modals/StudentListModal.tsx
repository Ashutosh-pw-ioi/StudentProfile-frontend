import { ArrowUpRight, X, Monitor } from "lucide-react";
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
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
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

          {/* Mobile Notice */}
          <div className="sm:hidden mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Monitor className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Better Experience Available
                </p>
                <p className="text-xs text-blue-600">
                  For better table viewing, consider using a laptop or desktop
                  device
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
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
                        className="flex items-center text-[#1B3A6A] font-medium cursor-pointer hover:text-[#1B3A6A]/80"
                      >
                        View Profile <ArrowUpRight className="ml-1 w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {selectedBatch.admittedStudents.map((student, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {student.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {student.enrollmentNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => onViewProfile(student)}
                      className="flex items-center text-[#1B3A6A] font-medium cursor-pointer hover:text-[#1B3A6A]/80 bg-blue-50 px-2 py-1 rounded text-xs"
                    >
                      View <ArrowUpRight className="ml-1 w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 break-all">
                      {student.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListModal;
