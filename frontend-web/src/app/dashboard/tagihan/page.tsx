// frontend-web/src/app/dashboard/tagihan/page.tsx (KODE FINAL & LENGKAP)
"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import TagihanTable, { Tagihan } from "@/components/TagihanTable";
import RecordPaymentDialog from "@/components/RecordPaymentDialog"; // <- Impor dialog pembayaran

export default function TagihanPage() {
  const [tagihanData, setTagihanData] = useState<Tagihan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk mengontrol dialog pembayaran
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/tagihan');
      setTagihanData(response.data);
    } catch (error) {
      console.error("Failed to fetch tagihan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi ini akan dipanggil oleh TagihanTable saat tombol "Bayar" diklik
  const handlePayClick = (tagihan: Tagihan) => {
    setSelectedTagihan(tagihan);
  };

  // Fungsi ini akan dipanggil oleh dialog saat pembayaran berhasil
  const handlePaymentSuccess = () => {
    fetchData(); // Ambil ulang data untuk me-refresh tabel
    setSelectedTagihan(null); // Tutup dialog
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manajemen Tagihan</h2>

      {isLoading ? (
        <p>Memuat data tagihan...</p>
      ) : (
        <TagihanTable data={tagihanData} onPay={handlePayClick} />
      )}

      {/* Aktifkan dan hubungkan dialog pembayaran */}
      <RecordPaymentDialog
        tagihan={selectedTagihan}
        isOpen={!!selectedTagihan}
        onClose={() => setSelectedTagihan(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}