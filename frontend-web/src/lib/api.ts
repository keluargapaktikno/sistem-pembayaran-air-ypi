// frontend-web/src/lib/api.ts (KODE BARU DENGAN INTERCEPTOR)
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // URL backend kita
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari state Zustand
    const token = useAuthStore.getState().token;

    // LOGGING UNTUK DEBUGGING
    console.log('Interceptor: Menggunakan token:', token);

    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor: Header Authorization di-set.');
      console.log('Interceptor: Headers:', config.headers); // DEBUG
    } else {
      console.warn('Interceptor: Tidak ada token yang ditemukan.');
      console.log('Interceptor: No token found'); // DEBUG
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;