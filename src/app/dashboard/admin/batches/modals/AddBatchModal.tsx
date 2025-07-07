import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCenter: string;
  onBatchCreated: () => void;
}

interface FormData {
  centerName: string;
  depName: string;
  batchName: string;
}

const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  userCenter,
  onBatchCreated,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    centerName: userCenter,
    depName: "",
    batchName: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        centerName: userCenter,
        depName: "",
        batchName: "",
      });
      setFormErrors({});
    }
  }, [isOpen, userCenter]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.depName.trim()) {
      errors.depName = "Department is required";
    }

    if (!formData.batchName.trim()) {
      errors.batchName = "Batch name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setFormErrors({});

      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const payload = {
        centerName: userCenter,
        depName: formData.depName,
        batchName: formData.batchName,
      };

      const response = await axios.post(
        "http://localhost:8000/api/batch/create",
        payload,
        { headers: { token } }
      );

      if (response.status === 201 || response.status === 200) {
        onBatchCreated();
        onClose();
      }
    } catch (error) {
      console.error("Error creating batch:", error);

      if (error instanceof AxiosError && error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
        return;
      }

      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Failed to create batch";
      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Batch</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center
              </label>
              <input
                type="text"
                value={userCenter}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="depName"
                value={formData.depName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.depName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select Department</option>
                <option value="SOT">School of Technology (SOT)</option>
                <option value="SOM">School of Management (SOM)</option>
                <option value="SOH">School of Humanities (SOH)</option>
              </select>
              {formErrors.depName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.depName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name *
              </label>
              <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleInputChange}
                placeholder="e.g., SOT24B1"
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.batchName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.batchName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.batchName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B3A6A] text-white rounded-md hover:bg-[#122A4E] flex items-center disabled:opacity-50 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Batch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;
