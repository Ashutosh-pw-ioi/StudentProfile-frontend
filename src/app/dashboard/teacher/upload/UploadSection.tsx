"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  X,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadSection() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenPresent, setTokenPresent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setTokenPresent(!!token);
    if (!token) {
      router.push("/auth/login/student");
    }
  }, [router]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];

      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls",
        ".xlsx",
      ];

      const isValidType = validTypes.some(
        (type) =>
          file.type === type ||
          file.name.toLowerCase().endsWith(".xls") ||
          file.name.toLowerCase().endsWith(".xlsx")
      );

      if (!isValidType) {
        setUploadStatus("error");
        setUploadedFile(null);
        return;
      }

      setUploadedFile(file);
      setUploadStatus("success");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href = "https://glqns72ea6.ufs.sh/f/35ZKzNsv5By61oPdNSQHWyStvbcNAs0uUq6hILf7wZlnmxj8"
    link.download = "sample_test_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!tokenPresent) {
    return null;
  }

  const SchemaHelpModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              XLS File Schema Guidelines
            </h2>
            <button
              onClick={() => setShowSchemaHelp(false)}
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upload Test Data</h1>
        <button
          onClick={() => setShowSchemaHelp(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#486AA0] transition-colors cursor-pointer bg-[#1B3A6A] duration-200 ease-in-out shadow-md"
        >
          <HelpCircle size={20} />
          Schema Help
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : uploadStatus === "error"
              ? "border-red-300 bg-red-50"
              : uploadStatus === "success"
              ? "border-green-300 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  File Ready
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                  <FileSpreadsheet size={20} />
                  <span>{uploadedFile.name}</span>
                  <span className="text-sm">
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={removeFile}
                    className="px-4 py-2 text-white rounded-lg hover:bg-[#486AA0] cursor-pointer transition-colors z-10 bg-[#1B3A6A] duration-200 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <AlertCircle className="text-red-500" size={48} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Invalid File Type
                </h3>
                <p className="text-red-600 mb-4">
                  Please upload only XLS or XLSX files
                </p>
                <button
                  onClick={() => setUploadStatus(null)}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload
                  className={`${
                    dragActive ? "text-blue-500" : "text-gray-400"
                  }`}
                  size={48}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {dragActive ? "Drop your XLS file here" : "Upload XLS File"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your XLS/XLSX file here, or click to browse
                </p>
                <div className="text-sm text-gray-500">
                  Supported formats: .xls, .xlsx • Max size: 10MB
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-[#D4E3F5] rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="text-[1B3A6A]" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">XLS/XLSX Only</h4>
            <p className="text-sm text-gray-600">
              We support Excel files in .xls and .xlsx formats
            </p>
          </div>
          <div 
            onClick={downloadSampleFile} 
            className="text-center p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-[#1B3A6A] rounded-lg flex items-center justify-center mx-auto mb-3">
              <Download className="text-[#D9A864]" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Download Sample</h4>
            <p className="text-sm text-gray-600">
              Click  Here to see the excel file format
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-[#D4E3F5] rounded-lg flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="text-[#1B3A6A]" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
              Click Schema Help to see formatting guidelines
            </p>
          </div>
        </div>
      </div>

      {showSchemaHelp && <SchemaHelpModal />}
    </div>
  );
}