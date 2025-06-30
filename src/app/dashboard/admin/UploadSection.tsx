"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import SchemaHelpModal from "./SchemaHelpModal";

export default function UploadSection() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="w-full mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-2 relative">
        <button
          onClick={() => setShowSchemaHelp(true)}
          className="text-white px-2 py-2 hover:bg-[#486AA0] transition-colors cursor-pointer bg-[#1B3A6A] duration-200 ease-in-out shadow-md absolute z-10 right-0 top-0 rounded-b-full rounded-l-full"
        >
          <HelpCircle size={20} />
        </button>
        <div
          className={`relative border-2 border-dashed rounded-lg py-4 px-8 text-center transition-all duration-200 ${
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
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  File Ready
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                  <FileSpreadsheet size={20} />
                  <span>{uploadedFile.name}</span>
                  <span className="text-sm">
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={removeFile}
                    className="px-4 py-1 text-white rounded-lg hover:bg-[#486AA0] cursor-pointer transition-colors z-10 bg-[#1B3A6A] duration-200 ease-in-out"
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
                  size={32}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {dragActive ? "Drop your XLS file here" : "Upload XLS File"}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">
                  Drag and drop your XLS/XLSX file here, or click to browse
                </p>
                <div className="text-sm text-gray-500">
                  Supported formats: .xls, .xlsx • Max size: 10MB
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSchemaHelp && (
        <SchemaHelpModal
          setShowSchemaHelp={setShowSchemaHelp}
          schemaInfo={{
            title: "Faculty Feedback Schema",
            columns: ["facultyID", "subject", "feedbackScore", "remarks"],
            sampleRow: ["F101", "Math", "4.5", "Great class"],
            columnDescriptions: [
              { key: "facultyID", description: "Unique faculty identifier" },
              { key: "subject", description: "Subject taught" },
              {
                key: "feedbackScore",
                description: "Numeric score (e.g., 4.5)",
              },
              { key: "remarks", description: "Optional comments" },
            ],
            guidelines: [
              "Column headers must match exactly",
              "Numeric fields should not contain text",
              "Only one sheet allowed",
            ],
            commonIssues: [
              "Wrong column names",
              "Merged cells",
              "Formulas instead of raw values",
            ],
          }}
        />
      )}
    </div>
  );
}
