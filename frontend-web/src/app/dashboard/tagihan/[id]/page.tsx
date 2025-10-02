// frontend-web/src/app/dashboard/tagihan/[id]/page.tsx (KODE BARU)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Tagihan } from "@/components/TagihanTable"; // Reuse the type
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// Tipe data yang lebih detail untuk halaman ini
interface DetailTagihan extends Tagihan {
  pencatatanMeter: {
    meter_awal: number;
    meter_akhir: number;
    pemakaian: number;
  };
  pembayaran: {
    tanggal_bayar: string;
    metode_pembayaran: string;
  } | null;
  tanggal_jatuh_tempo: string;
  biaya_abonemen: number;
  tarif_per_m3: number;
}

export default function DetailTagihanPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [tagihan, setTagihan] = useState<DetailTagihan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tagihan/${id}`);
      setTagihan(response.data);
    } catch (err: any) {
      console.error("Failed to fetch tagihan detail:", err);
      setError(err.response?.data?.message || "Gagal memuat detail tagihan.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  if (isLoading) return <p>Memuat detail tagihan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tagihan) return <p>Data tagihan tidak ditemukan.</p>;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Tagihan
        </Button>
        <h2 className="text-3xl font-bold">Detail Tagihan #{tagihan.nomor_tagihan}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Tagihan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between"><span>Status</span> <Badge variant={tagihan.status_pembayaran === 'LUNAS' ? 'default' : 'destructive'}>{tagihan.status_pembayaran.replace('_', ' ')}</Badge></div>
            <div className="flex justify-between"><span>Periode</span> <strong>{formatDate(tagihan.periode_tagihan)}</strong></div>
            <div className="flex justify-between"><span>Jatuh Tempo</span> <strong>{formatDate(tagihan.tanggal_jatuh_tempo)}</strong></div>
            {tagihan.pembayaran && (
              <div className="flex justify-between"><span>Tanggal Bayar</span> <strong>{formatDate(tagihan.pembayaran.tanggal_bayar)}</strong></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Warga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>{tagihan.warga.nama_lengkap}</strong></p>
            <p className="text-sm text-muted-foreground">{`Blok ${tagihan.warga.blok} No. ${tagihan.warga.nomor_rumah}`}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rincian Biaya</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              <tr className="border-b"><td className="py-2">Meter Awal</td><td className="text-right">{tagihan.pencatatanMeter.meter_awal} m³</td></tr>
              <tr className="border-b"><td className="py-2">Meter Akhir</td><td className="text-right">{tagihan.pencatatanMeter.meter_akhir} m³</td></tr>
              <tr className="border-b"><td className="py-2">Total Pemakaian</td><td className="text-right">{tagihan.pencatatanMeter.pemakaian} m³</td></tr>
              <tr className="border-b"><td className="py-2">Tarif per m³</td><td className="text-right">{formatCurrency(tagihan.tarif_per_m3)}</td></tr>
              <tr className="border-b"><td className="py-2">Biaya Abonemen</td><td className="text-right">{formatCurrency(tagihan.biaya_abonemen)}</td></tr>
              <tr className="font-bold"><td className="py-4 text-lg">Total Tagihan</td><td className="text-right text-lg">{formatCurrency(tagihan.total_tagihan)}</td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}