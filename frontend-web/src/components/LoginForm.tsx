// frontend-web/src/components/LoginForm.tsx (KODE LENGKAP & FUNGSIONAL)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api"; // <- Impor instance Axios kita
import { useAuthStore } from "@/store/authStore"; // <- Impor store Zustand kita

export default function LoginForm() {
  // State untuk menyimpan input dari form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // State untuk pesan error
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  // Mengambil fungsi setAuth dari store Zustand
  const { setAuth } = useAuthStore();

  // Fungsi yang akan dijalankan saat form disubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah form me-refresh halaman
    setIsLoading(true);
    setError(null);

    try {
      // Mengirim request POST ke backend
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      // Simpan token dan data profile ke state global Zustand
      setAuth(access_token, user);

      // Redirect ke halaman dashboard
      window.location.href = '/dashboard';

    } catch (err) {
      console.error("Login failed:", err);
      setError("Email atau password salah. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit}> {/* <- Tambahkan event handler onSubmit */}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Masukkan email dan password Anda untuk masuk ke dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@email.com"
                required
                value={email} // <- Hubungkan ke state
                onChange={(e) => setEmail(e.target.value)} // <- Update state saat diketik
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password} // <- Hubungkan ke state
                onChange={(e) => setPassword(e.target.value)} // <- Update state saat diketik
                disabled={isLoading}
              />
            </div>
            {/* Tampilkan pesan error jika ada */}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign in'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}