// frontend-web/src/app/dashboard/layout.tsx (KODE BARU)
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/Sidebar'; // <- Impor Sidebar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, profile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar /> {/* <- Tambahkan Sidebar di sini */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard YPI</h1>
            <div>
              <span>Selamat datang, <strong>{profile?.nama || profile?.email}</strong>!</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}