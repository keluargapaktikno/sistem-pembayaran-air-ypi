// frontend-web/src/app/dashboard/warga/page.tsx (KODE BARU DENGAN PAGINASI)
"use client";

import { useEffect, useState, useCallback } from "react";
import WargaTable, { Warga } from "@/components/WargaTable";
import api from "@/lib/api";
import AddWargaDialog from "@/components/AddWargaDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function WargaPage() {
  const [wargaResult, setWargaResult] = useState({
    data: [],
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      // Kirim request dengan parameter page
      const response = await api.get(`/warga?page=${page}&pageSize=20`);
      setWargaResult(response.data);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch warga:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= wargaResult.totalPages) {
      fetchData(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manajemen Warga</h2>
        <AddWargaDialog onSuccess={() => fetchData(1)} />
      </div>

      {isLoading ? (
        <p>Memuat data warga...</p>
      ) : (
        <>
          <WargaTable data={wargaResult.data} onDataChange={() => fetchData(currentPage)} />
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