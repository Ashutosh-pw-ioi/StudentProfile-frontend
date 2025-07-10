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
  onSuccess?: () => void;
  uploadUrl: string;
  schemaInfo: {
    title: string;
    columns: string[];
    sampleRow: string[];
    columnDescriptions: { key: string; description: string }[];
    guidelines: string[];
    commonIssues: string[];
    downloadLink: string;
  };
  fileSizeLimit?: number;
  validTypes?: string[];
  validExtensions?: string[];
}

export default function UploadSection({
  onSuccess,
  uploadUrl,
  schemaInfo,
  fileSizeLimit = 10 * 1024 * 1024, // Default 10MB
  validTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  validExtensions = [".xls", ".xlsx"],
}: UploadSectionProps) {
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
    const isValidType =
      validTypes.includes(file.type) ||
      validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setUploadStatus("error");
      setErrorMessage(
        `Invalid file type. Only ${validExtensions.join(
          ", "
        )} files are allowed.`
      );
      setUploadedFile(null);
      return;
    }

    if (file.size > fileSizeLimit) {
      setUploadStatus("error");
      setErrorMessage(
        `File size exceeds ${fileSizeLimit / 1024 / 1024}MB limit`
      );
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

  const uploadFile = async () => {
    if (!uploadedFile) return;

    setUploadStatus("uploading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          token: token,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadStatus("success");
        setSuccessMessage(result.message || "Data uploaded successfully!");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(result.message || "Failed to upload data");
      }
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message || "An error occurred during upload");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={validTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />

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
          {uploadStatus === "success" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Upload Successful!
                </h3>
                <p className="text-gray-600 mb-2">{successMessage}</p>
                <button
                  onClick={removeFile}
                  className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors relative z-10 cursor-pointer"
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
                  className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors relative z-10 cursor-pointer"
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
                Uploading Data...
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
                    className="px-4 py-2 text-[#1B3A6A] border border-[#1B3A6A] rounded-lg hover:bg-gray-100 transition-colors relative z-10 cursor-pointer"
                  >
                    Remove
                  </button>
                  <button
                    onClick={uploadFile}
                    className="px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#486AA0] transition-colors relative z-10 cursor-pointer"
                  >
                    Upload Data
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="space-y-4 cursor-pointer"
              onClick={triggerFileInput}
            >
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
                  {dragActive ? "Drop your Excel file here" : "Upload Data"}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">
                  Drag and drop your Excel file here, or click to browse
                </p>
                <div className="text-sm text-gray-500">
                  Supported formats: {validExtensions.join(", ")} • Max size:{" "}
                  {fileSizeLimit / 1024 / 1024}MB
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSchemaHelp && (
        <SchemaHelpModal
          setShowSchemaHelp={setShowSchemaHelp}
          schemaInfo={schemaInfo}
          downloadLink={schemaInfo.downloadLink}
        />
      )}
    </div>
  );
}
