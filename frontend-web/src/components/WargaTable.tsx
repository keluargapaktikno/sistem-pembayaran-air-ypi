// frontend-web/src/components/WargaTable.tsx (KODE BARU & INTERAKTIF)
"use client";

import { useState } from "react";
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
import { StatusHuni } from "@/lib/enums";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Impor dialog yang baru kita buat
import EditWargaDialog from "./EditWargaDialog";
import DeleteWargaAlert from "./DeleteWargaAlert";

// Definisikan tipe data yang lebih lengkap, kita butuh `nomor_telepon`
export interface Warga {
  id: string;
  nama_lengkap: string;
  blok: string;
  nomor_rumah: string;
  nomor_telepon: string;
  status_huni: StatusHuni;
  user: {
    email: string;
  };
}

interface WargaTableProps {
  data: Warga[];
  onDataChange: () => void; // Callback untuk me-refresh data
}

export default function WargaTable({ data, onDataChange }: WargaTableProps) {
  // State untuk mengelola dialog mana yang aktif dan untuk warga siapa
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [deletingWarga, setDeletingWarga] = useState<Warga | null>(null);

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status Huni</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((warga) => (
                <TableRow key={warga.id}>
                  <TableCell className="font-medium">{warga.nama_lengkap}</TableCell>
                  <TableCell>{`Blok ${warga.blok} No. ${warga.nomor_rumah}`}</TableCell>
                  <TableCell>{warga.user.email}</TableCell>
                  <TableCell>
                    <Badge variant={warga.status_huni === 'PEMILIK' ? 'default' : 'secondary'}>
                      {warga.status_huni}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Dropdown Menu untuk Aksi */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingWarga(warga)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeletingWarga(warga)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Render Dialog Edit, hanya jika ada `editingWarga` */}
      <EditWargaDialog
        warga={editingWarga}
        isOpen={!!editingWarga}
        onClose={() => setEditingWarga(null)}
        onSuccess={() => {
          onDataChange(); // Refresh data di parent
          setEditingWarga(null);
        }}
      />

      {/* Render Dialog Konfirmasi Hapus, hanya jika ada `deletingWarga` */}
      <DeleteWargaAlert
        warga={deletingWarga}
        isOpen={!!deletingWarga}
        onClose={() => setDeletingWarga(null)}
        onSuccess={() => {
          onDataChange(); // Refresh data di parent
          setDeletingWarga(null);
        }}
      />
    </>
  );
}