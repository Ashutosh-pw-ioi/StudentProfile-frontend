"use client";

import React from "react";
import { Download, X } from "lucide-react";

interface ColumnDescription {
  key: string;
  description: string;
}

interface SchemaInfo {
  title: string;
  columns: string[];
  sampleRow: string[];
  columnDescriptions: ColumnDescription[];
  guidelines: string[];
  commonIssues: string[];
}

interface SchemaHelpModalProps {
  setShowSchemaHelp: (show: boolean) => void;
  schemaInfo: SchemaInfo;
  downloadLink: string;
}

const downloadSampleFile = (downloadLink: string) => {
  const link = document.createElement("a");
  link.href = downloadLink;
  link.download = "sample_test_data.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SchemaHelpModal: React.FC<SchemaHelpModalProps> = ({
  setShowSchemaHelp,
  schemaInfo,
  downloadLink,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {schemaInfo.title} Schema Guide
          </h2>
          <button
            onClick={() => setShowSchemaHelp(false)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Download Sample
              </h1>
              <h4 className="text-xs">
                Click the button below to download the excel file format
              </h4>
            </div>
            <button
              onClick={() => downloadSampleFile(downloadLink)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center bg-[#1B3A6A] w-fit text-white py-2 px-4 rounded-lg gap-2 shadow-lg cursor-pointer">
                <Download />
                Download
              </div>
            </button>
          </div>
          {/* Column Structure */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Required Columns
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {schemaInfo.columns.map((column, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-2 rounded text-sm font-mono"
                >
                  {column}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              These columns must appear in the first row of your Excel file
            </p>
          </div>

          {/* Sample Data */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Sample Data Row
            </h3>
            <div className="bg-gray-50 border rounded-lg p-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {schemaInfo.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {schemaInfo.sampleRow.map((value, idx) => (
                      <td
                        key={idx}
                        className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-t"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Column Descriptions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Column Descriptions
            </h3>
            <div className="space-y-2">
              {schemaInfo.columnDescriptions.map((desc, idx) => (
                <div key={idx} className="flex">
                  <div className="font-medium text-gray-700 min-w-[120px]">
                    {desc.key}:
                  </div>
                  <div className="text-gray-600">{desc.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Guidelines
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {schemaInfo.guidelines.map((guideline, idx) => (
                <li key={idx}>{guideline}</li>
              ))}
            </ul>
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Common Issues to Avoid
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {schemaInfo.commonIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowSchemaHelp(false)}
              className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaHelpModal;
