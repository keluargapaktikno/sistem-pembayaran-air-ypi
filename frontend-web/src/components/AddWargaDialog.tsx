// frontend-web/src/components/AddWargaDialog.tsx (KODE LENGKAP)
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";

// Define StatusHuni enum locally since we can't import from @prisma/client in frontend
enum StatusHuni {
  PEMILIK = "PEMILIK",
  PENGONTRAK = "PENGONTRAK",
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

// 1. Definisikan skema validasi menggunakan Zod
const formSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  blok: z.string().max(3, "Blok maksimal 3 karakter").nonempty("Blok tidak boleh kosong"),
  nomor_rumah: z.string().max(5, "Nomor rumah maks 5 karakter").nonempty("Nomor rumah tidak boleh kosong"),
  nomor_telepon: z.string().min(10, "Nomor telepon minimal 10 digit"),
  status_huni: z.nativeEnum(StatusHuni),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

// Definisikan props untuk komponen, termasuk fungsi callback `onSuccess`
interface AddWargaDialogProps {
  onSuccess: () => void;
}

export default function AddWargaDialog({ onSuccess }: AddWargaDialogProps) {
  // State untuk mengontrol apakah dialog terbuka atau tertutup
  const [isOpen, setIsOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 2. Setup React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_lengkap: "",
      blok: "",
      nomor_rumah: "",
      nomor_telepon: "",
      status_huni: StatusHuni.PEMILIK,
      email: "",
      password: "",
    },
  });

  // 3. Definisikan fungsi yang akan dijalankan saat form disubmit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    try {
      await api.post('/warga', values);
      form.reset(); // Kosongkan form setelah berhasil
      onSuccess(); // Panggil fungsi callback dari parent
      setIsOpen(false); // Tutup dialog
    } catch (error) {
      console.error("Failed to add warga:", error);
      // Menampilkan pesan error yang lebih spesifik jika ada dari backend
      const axiosError = error as AxiosError;
      const message = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : "Terjadi kesalahan saat menambahkan warga.";
      setApiError(Array.isArray(message) ? message.join(', ') : message);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>+ Tambah Warga Baru</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Warga Baru</DialogTitle>
          <DialogDescription>
            Isi detail warga di bawah ini. Akun login akan dibuat secara otomatis.
          </DialogDescription>
        </DialogHeader>
        {/* 4. Bangun UI Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Awal</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ... tambahkan field lainnya ... */}
            <FormField
              control={form.control}
              name="blok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blok</FormLabel>
                  <FormControl>
                    <Input placeholder="A1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nomor_rumah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rumah</FormLabel>
                  <FormControl>
                    <Input placeholder="12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nomor_telepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="08123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status_huni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Huni</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status huni" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={StatusHuni.PEMILIK}>Pemilik</SelectItem>
                      <SelectItem value={StatusHuni.PENGONTRAK}>Pengontrak</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
            <Button type="submit" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}