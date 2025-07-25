import React from "react";
import { X, Users } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface TeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}

export default function TeachersModal({ isOpen, onClose, teachers }: TeachersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#1B3A6A]" />
            <h3 className="text-xl font-bold text-gray-800">
              Teachers List ({teachers.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {teachers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No teachers assigned to this course</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teachers.map((teacher, index) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#1B3A6A] text-white rounded-full flex items-center justify-center font-semibold">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{teacher.name}</h4>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Teacher #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
