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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              XLS File Schema Guidelines
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Required Format</h3>
              <p className="mb-2">
                Your XLS file should follow this exact structure for student
                test data:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2 font-semibold">
                        enrollmentNumber
                      </th>
                      <th className="text-left p-2 font-semibold">
                        courseCode
                      </th>
                      <th className="text-left p-2 font-semibold">date</th>
                      <th className="text-left p-2 font-semibold">testName</th>
                      <th className="text-left p-2 font-semibold">scoreType</th>
                      <th className="text-left p-2 font-semibold">
                        totalMarks
                      </th>
                      <th className="text-left p-2 font-semibold">
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
                      <td className="p-2">More rows...</td>
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
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Column Specifications
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">
                    enrollmentNumber:
                  </span>
                  <span>Student enrollment ID (e.g., 2302IN0138)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">
                    courseCode:
                  </span>
                  <span>Course identifier (e.g., C1SOM25B1S4)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">date:</span>
                  <span>Test date in DD/M/YY format (e.g., 26/6/25)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">testName:</span>
                  <span>Test identifier (e.g., FORTNIGHTLY_TEST)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">
                    scoreType:
                  </span>
                  <span>Test type description (e.g., FORTNIGHTLY TEST)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">
                    totalMarks:
                  </span>
                  <span>Maximum marks for the test (numeric)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">
                    obtainedMarks:
                  </span>
                  <span>Marks scored by student (numeric)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Important Guidelines
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Column headers must match exactly (case-sensitive)</li>
                <li>First row should contain column headers</li>
                <li>Data should start from the second row</li>
                <li>Date format: DD/M/YY or DD/MM/YY</li>
                <li>Marks should be numeric values only</li>
                <li>No empty rows between data entries</li>
                <li>Supported formats: .xls and .xlsx</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Common Issues to Avoid
              </h3>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                <li>Incorrect column header names or order</li>
                <li>Non-numeric values in marks columns</li>
                <li>Inconsistent date formats</li>
                <li>Merged cells in data area</li>
                <li>Multiple sheets (only first sheet will be processed)</li>
                <li>Formulas in data cells</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#486AA0] text-white rounded-lg hover:bg-[#1B3A6A] transition-colors duration-200 ease-in-out cursor-pointer"
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
