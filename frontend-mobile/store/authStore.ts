// frontend-mobile/store/authStore.ts (KODE LENGKAP)
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <- Penyimpanan untuk mobile

interface UserProfile {
  id: string;
  email: string;
  role: string;
  nama: string;
}

interface AuthState {
  token: string | null;
  profile: UserProfile | null;
  setAuth: (token: string, profile: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      setAuth: (token, profile) => set({ token, profile }),
      logout: () => set({ token: null, profile: null }),
    }),
    {
      name: 'auth-storage-mobile',
      storage: createJSONStorage(() => AsyncStorage), // <- Gunakan AsyncStorage
    },
  ),
);