// frontend-web/src/app/dashboard/warga/page.tsx (KODE FINAL DENGAN SEARCH & DEBOUNCING)
"use client";

import { useEffect, useState, useCallback } from "react";
import WargaTable from "@/components/WargaTable";
import api from "@/lib/api";
import AddWargaDialog from "@/components/AddWargaDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce"; // Hook kustom untuk debouncing

export default function WargaPage() {
  const [wargaResult, setWargaResult] = useState({
    data: [],
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce 500ms

  const fetchData = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      // Kirim request dengan parameter page dan search
      const response = await api.get(`/warga?page=${page}&pageSize=20&search=${search}`);
      setWargaResult(response.data);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch warga:", error);
      // Reset data jika terjadi error
      setWargaResult({ data: [], totalPages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect untuk memicu fetch data ketika search term yang sudah di-debounce berubah
  useEffect(() => {
    // Selalu kembali ke halaman 1 setiap kali ada pencarian baru
    fetchData(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= wargaResult.totalPages) {
      fetchData(newPage, debouncedSearchTerm);
    }
  };

  // Fungsi untuk me-refresh data pada halaman saat ini
  const refreshCurrentPage = () => {
    fetchData(currentPage, debouncedSearchTerm);
  }

  // Fungsi untuk me-refresh dan kembali ke halaman pertama (setelah menambah data)
  const refreshAndGoToFirstPage = () => {
    // Jika ada search term, reset dulu agar tidak bingung
    if (searchTerm) {
      setSearchTerm(""); // Ini akan memicu effect debouncedSearchTerm
    } else {
      fetchData(1, "");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Manajemen Warga</h2>
        <div className="flex-grow">
          <Input
            placeholder="Cari warga berdasarkan nama, email, atau alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <AddWargaDialog onSuccess={refreshAndGoToFirstPage} />
      </div>

      {isLoading ? (
        <p>Memuat data warga...</p>
      ) : (
        <>
          <WargaTable data={wargaResult.data} onDataChange={refreshCurrentPage} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
               <PaginationItem>
                 <span className="p-2">Halaman {currentPage} dari {wargaResult.totalPages}</span>
               </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                   className={currentPage === wargaResult.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}