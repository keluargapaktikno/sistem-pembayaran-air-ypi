// frontend-web/src/app/dashboard/pencatatan/page.tsx (KODE BARU)
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/api";
import { Warga } from "@/components/WargaTable"; // Menggunakan kembali tipe Warga
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Skema validasi untuk form input meter
const inputMeterSchema = z.object({
  meter_akhir: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0, "Meter akhir tidak boleh negatif")
  ),
});

export default function PencatatanPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Warga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const form = useForm<z.infer<typeof inputMeterSchema>>({
    resolver: zodResolver(inputMeterSchema),
    defaultValues: {
      meter_akhir: 0,
    },
  });

  const searchWarga = useCallback(async (search: string) => {
    if (search.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      // Kita hanya butuh beberapa hasil, jadi kita bisa batasi pageSize
      const response = await api.get(`/warga?search=${search}&pageSize=5`);
      setResults(response.data.data);
    } catch (error) {
      console.error("Failed to search warga:", error);
      toast({
        variant: "destructive",
        title: "Gagal Mencari Warga",
        description: "Terjadi kesalahan saat mencari data warga.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    searchWarga(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchWarga]);

  async function onSubmit(values: z.infer<typeof inputMeterSchema>) {
    if (!selectedWarga) return;

    try {
      await api.post("/pencatatan-meter", {
        wargaId: selectedWarga.id,
        meter_akhir: values.meter_akhir,
        // Backend akan menangani periode secara otomatis
        periode_pencatatan: new Date().toISOString().slice(0, 10),
      });
      toast({
        title: "Pencatatan Berhasil",
        description: `Meteran untuk ${selectedWarga.nama_lengkap} berhasil dicatat.`,
      });
      // Reset state setelah berhasil
      setSelectedWarga(null);
      setSearchTerm("");
      setResults([]);
      form.reset();
    } catch (error: any) {
      console.error("Failed to submit meter reading:", error);
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      toast({
        variant: "destructive",
        title: "Gagal Mencatat Meter",
        description: Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
      });
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Pencatatan Meter Air</h2>
        <p className="text-muted-foreground">
          Cari warga berdasarkan nama, lalu masukkan angka meteran terakhir.
        </p>
      </div>

      {!selectedWarga ? (
        <div className="space-y-4">
          <Input
            placeholder="Ketik nama warga untuk mencari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && <p>Mencari...</p>}
          <div className="space-y-2">
            {results.map((warga) => (
              <div
                key={warga.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{warga.nama_lengkap}</p>
                  <p className="text-sm text-muted-foreground">
                    {`Blok ${warga.blok} No. ${warga.nomor_rumah}`}
                  </p>
                </div>
                <Button onClick={() => setSelectedWarga(warga)}>Pilih</Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-lg">{selectedWarga.nama_lengkap}</p>
              <p className="text-sm text-muted-foreground">
                {`Blok ${selectedWarga.blok} No. ${selectedWarga.nomor_rumah}`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedWarga(null)}>
              Ganti Warga
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="meter_akhir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Angka Meteran Terakhir</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Contoh: 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Pencatatan"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}