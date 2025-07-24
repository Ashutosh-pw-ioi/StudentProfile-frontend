'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardFallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push('/'); 
      return;
    }

    const user = JSON.parse(userStr);

    switch (user.role) {
      case "STUDENT":
        router.replace("/dashboard/student");
        break;
      case "TEACHER":
        router.replace("/dashboard/teacher");
        break;
      case "ADMIN":
        router.replace("/dashboard/admin");
        break;
      case "SUPER_ADMIN":
        router.replace("/dashboard/superadmin");
        break;
      default:
        router.push("/unauthorized"); 
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
