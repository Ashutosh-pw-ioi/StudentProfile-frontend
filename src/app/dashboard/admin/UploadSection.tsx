"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import SchemaHelpModal from "./SchemaHelpModal";

interface UploadSectionProps {
  onSuccess?: () => void; // Add onSuccess callback
}

export default function UploadSection({ onSuccess }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExtensions = [".xls", ".xlsx"];

    const isValidType = validTypes.includes(file.type) || 
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setUploadStatus("error");
      setErrorMessage("Invalid file type. Only Excel files are allowed.");
      setUploadedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus("error");
      setErrorMessage("File size exceeds 10MB limit");
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadStudents = async () => {
    if (!uploadedFile) return;
    
    setUploadStatus("uploading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken"); // Use authToken
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch(
        "http://localhost:8000/api/student/add-student",
        {
          method: "POST",
          headers: {
            "token": token,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadStatus("success");
        setSuccessMessage(result.message || "Students added successfully!");
        
        // Trigger the refresh callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(result.message || "Failed to add students");
      }
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message || "An error occurred during upload");
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

          {uploadStatus === "success" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Students Added Successfully!
                </h3>
                <p className="text-gray-600 mb-2">{successMessage}</p>
                <button
                  onClick={removeFile}
                  className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <AlertCircle className="text-red-500" size={48} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Upload Failed
                </h3>
                <p className="text-red-600 mb-2">{errorMessage}</p>
                <button
                  onClick={removeFile}
                  className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : uploadStatus === "uploading" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="text-[#1B3A6A] animate-spin" size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Uploading Students...
              </h3>
              <p className="text-gray-600">
                Please wait while we process your file
              </p>
            </div>
          ) : uploadedFile ? (
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
                <div className="flex justify-center gap-3">
                  <button
                    onClick={removeFile}
                    className="px-4 py-2 text-[#1B3A6A] border border-[#1B3A6A] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={uploadStudents}
                    className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors"
                  >
                    Upload Students
                  </button>
                </div>
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
                  {dragActive ? "Drop your Excel file here" : "Upload Student Data"}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">
                  Drag and drop your Excel file here, or click to browse
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
            title: "Student Upload Schema",
            columns: [
              "name",
              "email",
              "password",
              "gender",
              "phoneNumber",
              "enrollmentNumber",
              "center",
              "department",
              "batch"
            ],
            sampleRow: [
              "John Doe", 
              "john@example.com", 
              "password123", 
              "Male", 
              "1234567890", 
              "ENR2024001", 
              "Patna", 
              "SOT", 
              "SOT24B1"
            ],
            columnDescriptions: [
              { key: "name", description: "Full name of the student" },
              { key: "email", description: "Email address of the student" },
              { key: "password", description: "Password for student account" },
              { key: "gender", description: "Gender (Male, Female, Other)" },
              { key: "phoneNumber", description: "Phone number (10 digits)" },
              { key: "enrollmentNumber", description: "Unique enrollment number" },
              { key: "center", description: "Center name (e.g., Patna)" },
              { key: "department", description: "Department (SOT, SOM, SOH)" },
              { key: "batch", description: "Batch name (e.g., SOT24B1)" },
            ],
            guidelines: [
              "Column headers must match exactly",
              "All fields are required",
              "Department should be one of: SOT, SOM, SOH",
              "Center name must match existing centers",
              "Batch names must match existing batches"
            ],
            commonIssues: [
              "Wrong column names",
              "Missing required fields",
              "Incorrect department or center names",
              "Duplicate enrollment numbers",
              "Invalid email formats"
            ],
          }}
        />
      )}
    </div>
  );
}