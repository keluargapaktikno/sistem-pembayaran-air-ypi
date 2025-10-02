// frontend-web/src/components/EditWargaDialog.tsx (KODE LENGKAP)
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StatusHuni } from "@/lib/enums";
import type { AxiosError } from "axios";
import { Warga } from "./WargaTable"; // Impor tipe Warga dari WargaTable

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

// Skema validasi untuk update, password tidak wajib
const formSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  blok: z.string().max(3).nonempty(),
  nomor_rumah: z.string().max(5).nonempty(),
  nomor_telepon: z.string().min(10, "Nomor telepon minimal 10 digit"),
  status_huni: z.nativeEnum(StatusHuni),
  // Kita tidak akan mengizinkan email & password diubah di sini untuk kesederhanaan
});

interface EditWargaDialogProps {
  warga: Warga | null; // Menerima data warga yang akan diedit
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditWargaDialog({ warga, isOpen, onClose, onSuccess }: EditWargaDialogProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        nama_lengkap: '',
        blok: '',
        nomor_rumah: '',
        nomor_telepon: '',
        status_huni: StatusHuni.PEMILIK,
    },
  });

  // Mengisi form dengan data warga saat dialog dibuka atau data berubah
  useEffect(() => {
    if (warga) {
      form.reset({
        nama_lengkap: warga.nama_lengkap,
        blok: warga.blok,
        nomor_rumah: warga.nomor_rumah,
        nomor_telepon: warga.nomor_telepon,
        status_huni: warga.status_huni,
      });
    }
  }, [warga, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!warga) return;
    setApiError(null);

    try {
      // Kirim request PATCH ke backend
      await api.patch(`/warga/${warga.id}`, values);
      onSuccess();
      onClose();
    } catch (err) {
      // Narrow error typing using AxiosError when possible
      let message = "Terjadi kesalahan.";
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError<{ message?: string | string[] }>;
        const respMsg = axiosErr.response?.data?.message;
        if (Array.isArray(respMsg)) {
          message = respMsg.join(", ");
        } else if (typeof respMsg === "string") {
          message = respMsg;
        }
      } else if (err instanceof Error) {
        message = err.message || message;
      } else {
        message = String(err);
      }

      console.error("Failed to update warga:", err);
      setApiError(Array.isArray(message) ? message.join(", ") : String(message));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Warga</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields di sini (mirip dengan AddWargaDialog) */}
            <FormField control={form.control} name="nama_lengkap" render={({ field }) => ( <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="blok" render={({ field }) => ( <FormItem><FormLabel>Blok</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="nomor_rumah" render={({ field }) => ( <FormItem><FormLabel>Nomor Rumah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="nomor_telepon" render={({ field }) => ( <FormItem><FormLabel>Nomor Telepon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="status_huni" render={({ field }) => ( <FormItem><FormLabel>Status Huni</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value={StatusHuni.PEMILIK}>Pemilik</SelectItem><SelectItem value={StatusHuni.PENGONTRAK}>Pengontrak</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />

            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
            <Button type="submit" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}