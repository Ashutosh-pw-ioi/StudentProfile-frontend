import React from "react";
import { X } from "lucide-react";

interface SchemaHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchemaHelpModal: React.FC<SchemaHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              XLS File Schema Guidelines
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-gray-700">
          {/* Required Format Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Required Format
            </h3>
            <p className="mb-3 text-sm sm:text-base">
              Your XLS file should follow this exact structure for student test
              data:
            </p>

            {/* Mobile-optimized table */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto">
              <div className="min-w-[600px]">
                <table className="w-full text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2 font-semibold text-gray-800">
                        enrollmentNumber
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        courseCode
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        date
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        testName
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        scoreType
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        totalMarks
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        obtainedMarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-gray-600">
                      <td className="p-2">2302IN0138</td>
                      <td className="p-2">C1SOM25B1S4</td>
                      <td className="p-2">26/6/25</td>
                      <td className="p-2">FORTNIGHTLY_TEST</td>
                      <td className="p-2">FORTNIGHTLY TEST</td>
                      <td className="p-2">100</td>
                      <td className="p-2">11</td>
                    </tr>
                    <tr className="text-gray-500 text-xs">
                      <td className="p-2 italic">More rows...</td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 mt-2 sm:hidden">
                ← Scroll horizontally to see all columns
              </div>
            </div>
          </div>

          {/* Column Specifications */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Column Specifications
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  enrollmentNumber:
                </div>
                <div className="text-gray-600">
                  Student enrollment ID (e.g., 2302IN0138)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  courseCode:
                </div>
                <div className="text-gray-600">
                  Course identifier (e.g., C1SOM25B1S4)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">date:</div>
                <div className="text-gray-600">
                  Test date in DD/M/YY format (e.g., 26/6/25)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  testName:
                </div>
                <div className="text-gray-600">
                  Test identifier (e.g., FORTNIGHTLY_TEST)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  scoreType:
                </div>
                <div className="text-gray-600">
                  Test type description (e.g., FORTNIGHTLY TEST)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  totalMarks:
                </div>
                <div className="text-gray-600">
                  Maximum marks for the test (numeric)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  obtainedMarks:
                </div>
                <div className="text-gray-600">
                  Marks scored by student (numeric)
                </div>
              </div>
            </div>
          </div>

          {/* Important Guidelines */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Important Guidelines
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Column headers must match exactly (case-sensitive)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>First row should contain column headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Data should start from the second row</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Date format: DD/M/YY or DD/MM/YY</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Marks should be numeric values only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>No empty rows between data entries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Supported formats: .xls and .xlsx</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Common Issues to Avoid
            </h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Incorrect column header names or order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Non-numeric values in marks columns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Inconsistent date formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Merged cells in data area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>
                    Multiple sheets (only first sheet will be processed)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Formulas in data cells</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-[#486AA0] text-white rounded-lg hover:bg-[#1B3A6A] transition-colors duration-200 ease-in-out cursor-pointer font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaHelpModal;
