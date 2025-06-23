"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface LoginPageProps {
  role: "student" | "admin" | "teacher";
  imagePath: string;
  bgColor?: string;
  primaryColor?: string;
  hoverColor?: string;
  focusColor?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface ApiError {
  message: string;
}

const roleConfig = {
  student: {
    title: "Student Portal",
    subtitle: "Access your student dashboard",
    emailPlaceholder: "Enter your student email",
    apiRole: "STUDENT",
  },
  admin: {
    title: "Admin Portal",
    subtitle: "Welcome back to your admin panel",
    emailPlaceholder: "Enter your admin email",
    apiRole: "ADMIN",
  },
  teacher: {
    title: "Teacher Portal",
    subtitle: "Welcome back to your teacher panel",
    emailPlaceholder: "Enter your teacher email",
    apiRole: "TEACHER",
  },
};

export default function LoginPage({
  role,
  imagePath,
  bgColor = "#F1CB8D",
  primaryColor = "#1B3A6A",
  hoverColor = "#486AA0",
  focusColor = "#D9A864",
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const config = roleConfig[role];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8000/api/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
          role: config.apiRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(
        `Welcome back, ${user.email}! Redirecting to ${role} dashboard...`
      );

      setTimeout(() => {
        window.location.href = `/${role}/dashboard`;
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const apiError = error.response.data as ApiError;
          const statusCode = error.response.status;

          switch (statusCode) {
            case 400:
              toast.error(
                apiError.message || "Invalid request. Please check your input."
              );
              break;
            case 401:
              toast.error("Invalid email or password. Please try again.");
              break;
            case 403:
              toast.error("Access denied. Please contact support.");
              break;
            case 404:
              toast.error("Service not found. Please try again later.");
              break;
            case 500:
              toast.error("Server error. Please try again later.");
              break;
            default:
              toast.error(
                apiError.message || "Login failed. Please try again."
              );
          }
        } else if (error.request) {
          toast.error(
            "Unable to connect to server. Please check your internet connection."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full md:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600">{config.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder={config.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                style={
                  {
                    "--tw-ring-color": primaryColor,
                    focusRingColor: primaryColor,
                  } as React.CSSProperties
                }
                onFocus={(e) =>
                  (e.target.style.boxShadow = `0 0 0 2px ${primaryColor}`)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                onFocus={(e) =>
                  (e.target.style.boxShadow = `0 0 0 2px ${primaryColor}`)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center cursor-pointer"
              style={
                {
                  backgroundColor: primaryColor,
                  "--hover-color": hoverColor,
                  "--focus-ring-color": focusColor,
                } as React.CSSProperties
              }
              onMouseEnter={(e) =>
                !isLoading &&
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseLeave={(e) =>
                !isLoading &&
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Logging in...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>
        </div>

        <div className="hidden md:block w-[55%]">
          <img
            src={imagePath}
            className="w-full h-full object-cover"
            alt={`${role} login`}
          />
        </div>
      </div>
    </div>
  );
}
