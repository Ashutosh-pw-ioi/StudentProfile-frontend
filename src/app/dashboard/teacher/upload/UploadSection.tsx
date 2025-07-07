"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SchemaHelpModal from "../Modals/SchemaHelpModal";

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
    link.href =
      "https://glqns72ea6.ufs.sh/f/35ZKzNsv5By61oPdNSQHWyStvbcNAs0uUq6hILf7wZlnmxj8";
    link.download = "sample_test_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!tokenPresent) {
    return null;
  }

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
            <h4 className="font-semibold text-gray-800 mb-2">
              Download Sample
            </h4>
            <p className="text-sm text-gray-600">
              Click Here to see the excel file format
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

      <SchemaHelpModal
        isOpen={showSchemaHelp}
        onClose={() => setShowSchemaHelp(false)}
      />
    </div>
  );
}
