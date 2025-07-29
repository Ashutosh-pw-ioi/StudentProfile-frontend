"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const decodeToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(
      paddedPayload.replace(/-/g, "+").replace(/_/g, "/")
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const { id, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/reset-password/${id}/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message);
      setError("");

      const decodedToken = decodeToken(token as string);
      const userRole = decodedToken?.role.toLowerCase() || "user";

      setTimeout(() => {
        router.push(`/auth/login/${userRole}`);
      }, 500);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Something went wrong.");
      } else {
        setError("Server error. Try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#ffe4b8] to-[#ffddb0] px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-lg">
        <div className="flex justify-center mb-6">
          <img src="/PWIOILogoBlack.png" alt="App Logo" className="w-1/2" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm px-10">
          Enter your new password below. Make sure it's strong and unique!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div
              className="absolute top-[38px] right-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div
              className="absolute top-[38px] right-3 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#486AA0] text-white py-3 rounded-lg font-semibold hover:bg-[#1B3A6A] transition duration-200 cursor-pointer"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Need help?{" "}
          <a href="/support" className="text-[#1B3A6A] hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
