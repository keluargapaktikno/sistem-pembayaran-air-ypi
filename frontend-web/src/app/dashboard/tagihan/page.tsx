// frontend-web/src/app/dashboard/tagihan/page.tsx (KODE BARU DENGAN PAGINASI & FILTER)
"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import TagihanTable, { Tagihan } from "@/components/TagihanTable";
import RecordPaymentDialog from "@/components/RecordPaymentDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TagihanPage() {
  const [tagihanResult, setTagihanResult] = useState({ data: [], totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);

  const fetchData = useCallback(async (page: number, status: string) => {
    setIsLoading(true);
    try {
      const statusQuery = status !== "ALL" ? `&status=${status}` : "";
      const response = await api.get(`/tagihan?page=${page}&pageSize=10${statusQuery}`);
      setTagihanResult(response.data);
    } catch (error) {
      console.error("Failed to fetch tagihan:", error);
      setTagihanResult({ data: [], totalPages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, statusFilter);
  }, [fetchData, currentPage, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= tagihanResult.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (newStatus: string) => {
    setCurrentPage(1);
    setStatusFilter(newStatus);
  };

  const handlePayClick = (tagihan: Tagihan) => setSelectedTagihan(tagihan);
  const handlePaymentSuccess = () => {
    fetchData(currentPage, statusFilter);
    setSelectedTagihan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manajemen Tagihan</h2>
        <div className="w-[180px]">
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter berdasarkan status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="BELUM_BAYAR">Belum Bayar</SelectItem>
              <SelectItem value="LUNAS">Lunas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p>Memuat data tagihan...</p>
      ) : (
        <>
          <TagihanTable data={tagihanResult.data} onPay={handlePayClick} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="p-2">Halaman {currentPage} dari {tagihanResult.totalPages}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  className={currentPage === tagihanResult.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <RecordPaymentDialog
        tagihan={selectedTagihan}
        isOpen={!!selectedTagihan}
        onClose={() => setSelectedTagihan(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}