'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, SearchX } from 'lucide-react'; // Optional: Install `lucide-react` for icons

export default function TeacherFallbackPage() {
  const path = usePathname();

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-lg w-full text-center">
        <div className="flex justify-center mb-4 text-yellow-500">
          <SearchX className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">404 – Page Not Found</h1>
        <p className="text-gray-600 mb-4">
          The path  does not exist in the Teacher Dashboard.
        </p>
        <Link
          href="/dashboard/teacher"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          ← Back to Teacher Dashboard
        </Link>
      </div>
    </div>
  );
}
