// frontend-web/src/components/TagihanTable.tsx (KODE LENGKAP)
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

export interface Tagihan {
  id: string;
  nomor_tagihan: string;
  periode_tagihan: string;
  total_tagihan: number;
  status_pembayaran: 'BELUM_BAYAR' | 'LUNAS';
  warga: {
    nama_lengkap: string;
    blok: string;
    nomor_rumah: string;
  };
}

interface TagihanTableProps {
  data: Tagihan[];
  onPay: (tagihan: Tagihan) => void; // Callback saat tombol "Bayar" diklik
}

export default function TagihanTable({ data, onPay }: TagihanTableProps) {
  // Fungsi untuk format mata uang
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fungsi untuk format periode
  const formatPeriode = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('id-ID', { month: 'long', year: 'numeric'});
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Tagihan</TableHead>
            <TableHead>Nama Warga</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tagihan) => (
            <TableRow key={tagihan.id}>
              <TableCell className="font-mono">{tagihan.nomor_tagihan}</TableCell>
              <TableCell>{tagihan.warga.nama_lengkap}</TableCell>
              <TableCell>{formatPeriode(tagihan.periode_tagihan)}</TableCell>
              <TableCell>{formatCurrency(tagihan.total_tagihan)}</TableCell>
              <TableCell>
                <Badge variant={tagihan.status_pembayaran === 'LUNAS' ? 'default' : 'destructive'}>
                  {tagihan.status_pembayaran.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {tagihan.status_pembayaran === 'BELUM_BAYAR' && (
                  <Button size="sm" onClick={() => onPay(tagihan)}>
                    Bayar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}