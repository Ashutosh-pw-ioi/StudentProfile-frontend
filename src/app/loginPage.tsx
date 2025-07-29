"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, MailCheck } from "lucide-react";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstLoggedIn: boolean;
  };
}

interface LoginPageProps {
  role: "student" | "admin" | "teacher";
  imagePath: string;
  bgColor?: string;
  primaryColor?: string;
  hoverColor?: string;
  focusColor?: string;
}

interface ApiError {
  message: string;
}

const roleConfig = {
  student: {
    title: "Student Portal",
    subtitle: "Access your student dashboard",
    emailPlaceholder: "Enter your student email",
    apiRole: "Student",
  },
  admin: {
    title: "Admin Portal",
    subtitle: "Welcome back to your admin panel",
    emailPlaceholder: "Enter your admin email",
    apiRole: "Admin",
  },
  teacher: {
    title: "Teacher Portal",
    subtitle: "Welcome back to your teacher panel",
    emailPlaceholder: "Enter your teacher email",
    apiRole: "Teacher",
  },
};

export default function LoginPage({
  role,
  imagePath,
  bgColor = "#F1CB8D",
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userIdForPasswordReset, setUserIdForPasswordReset] = useState("");
  const [userTokenForPasswordReset, setUserTokenForPasswordReset] =
    useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const config = roleConfig[role];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address", {
        toastId: "email-required",
      });
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password", {
        toastId: "password-required",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address", {
        toastId: "email-invalid",
      });
      return;
    }

    setIsLoading(true);

    console.log(`${backendUrl}/api/auth/login`);

    try {
      const response = await axios.post<LoginResponse>(
        `${backendUrl}/api/auth/login`,
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

      // Check if this is first time login
      if (!user.firstLoggedIn) {
        setIsFirstTimeLogin(true);
        setUserIdForPasswordReset(user.id);
        setUserTokenForPasswordReset(token);
        setIsLoading(false); // Important: Set loading to false so modal can show
        return;
      }

      if (isClient && typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success(`Welcome back! Redirecting to your ${role} dashboard...`, {
        toastId: "login-success",
        autoClose: 2000,
      });

      router.push(`/dashboard/${role}`);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;
          const apiError = error.response.data as ApiError;

          switch (statusCode) {
            case 400:
              errorMessage =
                apiError.message || "Invalid request. Please check your input.";
              break;
            case 401:
              errorMessage = "Invalid email or password. Please try again.";
              break;
            case 403:
              errorMessage = `Access denied. You don't have ${role} permissions.`;
              break;
            case 404:
              errorMessage = "Login service not found. Please contact support.";
              break;
            case 422:
              errorMessage =
                "Invalid input data. Please check your credentials.";
              break;
            case 429:
              errorMessage = "Too many login attempts. Please try again later.";
              break;
            case 500:
            case 502:
            case 503:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage =
                apiError.message || "Login failed. Please try again.";
          }
        } else if (error.request) {
          errorMessage =
            "Unable to connect to server. Please check your internet connection.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Please try again.";
        }
      }

      toast.error(errorMessage, {
        toastId: "login-error",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsResettingPassword(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/first-reset-password/${userIdForPasswordReset}/${userTokenForPasswordReset}`,
        {
          password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully!");

      // After successful password set, do full login
      const loginRes = await axios.post<LoginResponse>(
        `${backendUrl}/api/auth/login`,
        {
          email: email.trim(),
          password: newPassword,
          role: config.apiRole,
        }
      );

      const { token: newToken, user: newUser } = loginRes.data;

      if (isClient && typeof window !== "undefined") {
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      router.push(`/dashboard/${role}`);
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error("Failed to set password. Please try again.");
    } finally {
      setIsResettingPassword(false);
      setIsFirstTimeLogin(false);
      // Reset form fields
      setNewPassword("");
      setConfirmPassword("");
      setUserIdForPasswordReset("");
      setUserTokenForPasswordReset("");
    }
  };

  const handleCancelPasswordReset = () => {
    setIsFirstTimeLogin(false);
    setNewPassword("");
    setConfirmPassword("");
    setUserIdForPasswordReset("");
    setUserTokenForPasswordReset("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      {isFirstTimeLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center p-4 shadow-2xl">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Set New Password
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This is your first time logging in. Please set a new password to
              continue.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#486AA0] pr-10"
                  minLength={6}
                />
                <div
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#486AA0] pr-10"
                  minLength={6}
                />
                <div
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCancelPasswordReset}
                disabled={isResettingPassword}
                className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handlePasswordReset}
                disabled={
                  isResettingPassword || !newPassword || !confirmPassword
                }
                className="text-sm px-4 py-2 bg-[#1B3A6A] text-white hover:bg-[#486AA0] rounded-md disabled:opacity-50 cursor-pointer"
              >
                {isResettingPassword ? "Setting Password..." : "Set Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-2xl transition-all">
            {!forgotEmailSent ? (
              <>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Reset Password
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your registered email and we&lsquo;ll send you a verification
                  link.
                </p>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#486AA0]"
                />

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotEmail("");
                      setForgotEmailSent(false);
                    }}
                    className="text-sm px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(forgotEmail.trim())) {
                        toast.error("Please enter a valid email address.");
                        return;
                      }

                      setIsSendingLink(true);
                      try {
                        const res = await axios.post(
                          `${backendUrl}/api/auth/forget-password`,
                          { email: forgotEmail.trim(), role: config.apiRole }
                        );

                        toast.success("Verification link sent to your email.");
                        setForgotEmailSent(true);
                      } catch (err) {
                        toast.error(
                          "Unable to send reset link. Try again later."
                        );
                      } finally {
                        setIsSendingLink(false);
                      }
                    }}
                    disabled={isSendingLink}
                    className="text-sm px-4 py-2 rounded-md bg-[#486AA0] text-white hover:bg-[#1B3A6A] disabled:opacity-50 cursor-pointer"
                  >
                    {isSendingLink ? "Sending..." : "Send Link"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center px-10">
                <MailCheck className="w-10 h-10 mb-2 text-[#1B3A6A]" />
                <h2 className="text-lg font-semibold mb-1 text-green-700">
                  Email Sent Successfully
                </h2>
                <p className="text-sm text-gray-700 mb-4 text-center">
                  A password reset link has been sent to{" "}
                  <span className="font-medium text-black">{forgotEmail}</span>.
                  Please check your inbox (and spam folder).
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotEmail("");
                      setForgotEmailSent(false);
                    }}
                    className="text-sm px-4 py-2 rounded-md bg-[#486AA0] text-white hover:bg-[#1B3A6A] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
        className="!z-50"
        toastClassName="!rounded-lg !text-sm"
      />

      <div className="flex max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full md:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600 mt-2">{config.subtitle}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#486AA0] focus:border-[#486AA0] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>

            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#486AA0] focus:border-[#486AA0] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                <div
                  className="text-xs hover:underline duration-50 ease-in-out right-0 mt-2 cursor-pointer absolute"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forget Password?
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center bg-[#486AA0] hover:bg-[#1B3A6A] cursor-pointer ease-in-out"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
          <Image
            src={imagePath}
            width={500}
            height={500}
            className="w-full h-full object-cover"
            alt={`${config.title} illustration`}
            onError={(e) => {
              console.warn("Image failed to load:", imagePath);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}
