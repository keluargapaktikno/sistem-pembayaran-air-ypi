// frontend-web/src/components/RecordPaymentDialog.tsx (KODE LENGKAP)
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import api from "@/lib/api";
import { Tagihan } from "./TagihanTable"; // Impor tipe data Tagihan

interface RecordPaymentDialogProps {
  tagihan: Tagihan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordPaymentDialog({ tagihan, isOpen, onClose, onSuccess }: RecordPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayment = async () => {
    if (!tagihan) return;

    setIsSubmitting(true);
    setError(null);
    try {
      // Siapkan payload untuk dikirim ke API
      const payload = {
        tagihanId: tagihan.id,
        metode_pembayaran: 'TUNAI', // Sesuai MVP, kita hardcode TUNAI
        jumlah_bayar: tagihan.total_tagihan,
      };

      // Panggil endpoint POST /pembayaran
      await api.post('/pembayaran', payload);

      onSuccess(); // Panggil callback untuk me-refresh data di tabel
      onClose(); // Tutup dialog

    } catch (err: any) {
      console.error("Payment failed:", err);
      setError(err.response?.data?.message || "Gagal mencatat pembayaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tagihan) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              Anda akan mencatat pembayaran untuk tagihan berikut:
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div><strong>No. Tagihan:</strong> {tagihan.nomor_tagihan}</div>
                <div><strong>Nama:</strong> {tagihan.warga.nama_lengkap}</div>
                <div><strong>Total:</strong> <span className="font-bold text-lg">{formatCurrency(tagihan.total_tagihan)}</span></div>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handlePayment} disabled={isSubmitting} asChild>
            <Button>
              {isSubmitting ? "Memproses..." : "Ya, Konfirmasi Pembayaran"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}