import { X } from "lucide-react";
import { Student } from "../interfaces/CourseDetails";

interface StudentProfileModalProps {
  showModal: boolean;
  selectedStudent: Student | null;
  onClose: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  showModal,
  selectedStudent,
  onClose,
}) => {
  if (!showModal || !selectedStudent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Student Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-6 pb-4 border-b">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedStudent.name || "NA"}
            </h3>
            <p className="text-gray-600">
              Enrollment No: {selectedStudent.enrollmentNumber || "NA"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Personal Information
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedStudent.email || "NA"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedStudent.phoneNumber || "NA"}
                </p>
                <p>
                  <span className="font-medium">Gender:</span>{" "}
                  {selectedStudent.gender || "NA"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Academic Info
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Semester:</span>{" "}
                  {selectedStudent.semesterNo || "NA"}
                </p>
                <p>
                  <span className="font-medium">Batch:</span>{" "}
                  {selectedStudent.batch?.name || "NA"}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {selectedStudent.department?.name || "NA"}
                </p>
                <p>
                  <span className="font-medium">Center:</span>{" "}
                  {selectedStudent.center?.name || "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
