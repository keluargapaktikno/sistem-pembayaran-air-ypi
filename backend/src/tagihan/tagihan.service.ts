// backend/src/tagihan/tagihan.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagihanService {
  constructor(private prisma: PrismaService) {}

  // Generate invoices untuk semua pencatatan meter yang belum punya tagihan
  async generateInvoices() {
    // Cari pencatatan meter yang belum punya tagihan
    const pencatatanTanpaTagihan = await this.prisma.pencatatanMeter.findMany({
      where: {
        tagihan: null, // Belum ada tagihan
      },
      include: {
        warga: true,
      },
    });

    if (pencatatanTanpaTagihan.length === 0) {
      return { message: 'Tidak ada pencatatan meter yang belum ditagihkan.' };
    }

    const invoices: any[] = [];

    for (const pencatatan of pencatatanTanpaTagihan) {
      // Hitung total tagihan
      const tarifPerM3 = 5000; // Tarif flat, bisa diubah nanti
      const biayaAbonemen = 10000; // Biaya abonemen flat
      const totalTagihan = pencatatan.pemakaian * tarifPerM3 + biayaAbonemen;

      // Generate nomor tagihan unik
      const nomorTagihan = `INV-${Date.now()}-${pencatatan.id.slice(-6)}`;

      // Tanggal jatuh tempo: 15 hari setelah periode pencatatan
      const tanggalJatuhTempo = new Date(pencatatan.periode_pencatatan);
      tanggalJatuhTempo.setDate(tanggalJatuhTempo.getDate() + 15);

      // Buat tagihan
      const tagihan = await this.prisma.tagihan.create({
        data: {
          nomor_tagihan: nomorTagihan,
          periode_tagihan: pencatatan.periode_pencatatan,
          jumlah_pemakaian_m3: pencatatan.pemakaian,
          tarif_per_m3: tarifPerM3,
          biaya_abonemen: biayaAbonemen,
          total_tagihan: totalTagihan,
          tanggal_jatuh_tempo: tanggalJatuhTempo,
          pencatatanMeterId: pencatatan.id,
          wargaId: pencatatan.wargaId,
        },
        include: {
          warga: {
            select: { nama_lengkap: true, blok: true, nomor_rumah: true },
          },
        },
      });

      invoices.push(tagihan);
    }

    return {
      message: `Berhasil generate ${invoices.length} tagihan.`,
      invoices,
    };
  }

  // Mendapatkan semua tagihan
  async getAllTagihan() {
    return this.prisma.tagihan.findMany({
      include: {
        warga: {
          select: { nama_lengkap: true, blok: true, nomor_rumah: true },
        },
      },
    });
  }
}