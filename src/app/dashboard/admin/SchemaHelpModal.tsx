import React from "react";
import { X } from "lucide-react";

interface ColumnInfo {
  key: string;
  description: string;
}

interface SchemaHelpContent {
  title: string;
  columns: string[];
  sampleRow: string[];
  columnDescriptions: ColumnInfo[];
  guidelines: string[];
  commonIssues: string[];
}

interface SchemaHelpModalProps {
  setShowSchemaHelp: (show: boolean) => void;
  schemaInfo: SchemaHelpContent;
}

const SchemaHelpModal = ({
  setShowSchemaHelp,
  schemaInfo,
}: SchemaHelpModalProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {schemaInfo.title}
          </h2>
          <button
            onClick={() => setShowSchemaHelp(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Schema Table */}
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-lg mb-2">Required Format</h3>
            <p className="mb-2">
              Your XLS file should follow this exact structure:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-gray-300">
                    {schemaInfo.columns.map((col, idx) => (
                      <th key={idx} className="text-left p-2 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-600">
                    {schemaInfo.sampleRow.map((val, idx) => (
                      <td key={idx} className="p-2">
                        {val}
                      </td>
                    ))}
                  </tr>
                  <tr className="text-gray-500 text-xs">
                    <td className="p-2">More rows...</td>
                    {schemaInfo.columns.slice(1).map((_, i) => (
                      <td key={i} className="p-2"></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Column Descriptions */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Column Specifications
            </h3>
            <div className="space-y-2 text-sm">
              {schemaInfo.columnDescriptions.map((col, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">
                    {col.key}:
                  </span>
                  <span>{col.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Important Guidelines</h3>
            <ul className="list-disc list-inside space-y-1">
              {schemaInfo.guidelines.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Common Issues to Avoid
            </h3>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {schemaInfo.commonIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowSchemaHelp(false)}
            className="px-6 py-2 bg-[#486AA0] text-white rounded-lg hover:bg-[#1B3A6A] transition-colors duration-200 ease-in-out cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SchemaHelpModal;
