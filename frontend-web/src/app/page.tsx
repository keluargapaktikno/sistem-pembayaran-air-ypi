// frontend-web/src/app/page.tsx (KODE BARU)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  const router = useRouter();
  const { token, isHydrated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Jika user sudah login, redirect ke dashboard
    if (isHydrated && token) {
      router.push('/dashboard');
    }
  }, [token, isHydrated, router]);

  // Show loading until hydrated and client-side rendering
  if (!isClient || !isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika belum login, tampilkan form login
  return <LoginForm />;
}