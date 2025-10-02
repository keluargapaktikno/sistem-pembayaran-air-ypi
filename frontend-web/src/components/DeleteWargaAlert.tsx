// frontend-web/src/components/DeleteWargaAlert.tsx (KODE LENGKAP)
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
import { Warga } from "./WargaTable";

interface DeleteWargaAlertProps {
  warga: Warga | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteWargaAlert({ warga, isOpen, onClose, onSuccess }: DeleteWargaAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!warga) return;
    setIsDeleting(true);
    try {
      await api.delete(`/warga/${warga.id}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete warga:", error);
      // Tambahkan notifikasi error jika perlu
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data warga
            <strong> {warga?.nama_lengkap} </strong>
            secara permanen beserta akun login terkait.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} asChild>
            <Button variant="destructive">
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}