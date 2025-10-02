// frontend-web/src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

// Hook kustom untuk men-debounce sebuah nilai.
// Ini berguna untuk menunda eksekusi fungsi yang berat (seperti pencarian API)
// sampai pengguna berhenti mengetik selama interval waktu tertentu.
export function useDebounce<T>(value: T, delay: number): T {
  // State untuk menyimpan nilai yang sudah di-debounce
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout untuk mengubah nilai debounced setelah `delay` ms
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Fungsi cleanup untuk useEffect.
    // Ini akan membersihkan timeout setiap kali `value` atau `delay` berubah,
    // sehingga timeout yang lama tidak akan pernah dijalankan.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya jalankan ulang effect jika value atau delay berubah

  return debouncedValue;
}