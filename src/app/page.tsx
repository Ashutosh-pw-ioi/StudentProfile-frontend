"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Main Page</h1>
      <button
        onClick={() => router.push("/studentlogin")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Student Login
      </button>
      <button
        onClick={() => router.push("/teacherlogin")}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
      >
        Teacher Login
      </button>
      <button
        onClick={() => router.push("/adminlogin")}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
      >
        Admin Login
      </button>
    </div>
  );
}
