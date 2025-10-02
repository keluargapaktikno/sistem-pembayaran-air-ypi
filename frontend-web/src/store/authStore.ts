// frontend-web/src/store/authStore.ts (KODE DIPERBAIKI)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  email: string;
  nama: string;
  role: string;
}

interface AuthState {
  token: string | null;
  profile: UserProfile | null;
  isHydrated: boolean;
  setAuth: (token: string, profile: UserProfile) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      isHydrated: false,
      setAuth: (token, profile) => set({ token, profile }),
      logout: () => set({ token: null, profile: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage', // Nama key di localStorage
      // MENGGUNAKAN onFinishHydration YANG BENAR UNTUK ZUSTAND v4+
      onFinishHydration: (state) => {
        state?.setHydrated();
      },
    },
  ),
);