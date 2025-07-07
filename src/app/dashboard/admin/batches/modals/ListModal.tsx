import React from "react";
import { X } from "lucide-react";

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

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Student[] | Teacher[];
  type: "students" | "teachers";
  emptyMessage?: string;
}

const ListModal: React.FC<ListModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type,
  emptyMessage,
}) => {
  if (!isOpen) return null;

  const isStudentData = (item: Student | Teacher): item is Student => {
    return type === "students" && "enrollmentNumber" in item;
  };

  const defaultEmptyMessage =
    type === "students"
      ? "No students found in this batch."
      : "No teachers assigned to this batch.";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-500 hover:text-gray-700" />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-4 pr-8">{title}</h3>

        {data.length > 0 ? (
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
                  {type === "students" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Number
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.email}
                    </td>
                    {type === "students" && isStudentData(item) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.enrollmentNumber}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {emptyMessage || defaultEmptyMessage}
          </p>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListModal;
