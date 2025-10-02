// backend/src/pembayaran/pembayaran.service.ts (KODE LENGKAP)
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';
import { StatusPembayaran } from '@prisma/client';

@Injectable()
export class PembayaranService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePembayaranDto, kasirId: string) {
    const { tagihanId, jumlah_bayar, metode_pembayaran } = dto;

    // 1. Cari tagihan yang akan dibayar
    const tagihan = await this.prisma.tagihan.findUnique({
      where: { id: tagihanId },
    });

    if (!tagihan) {
      throw new NotFoundException(`Tagihan dengan ID ${tagihanId} tidak ditemukan.`);
    }

    if (tagihan.status_pembayaran === StatusPembayaran.LUNAS) {
      throw new BadRequestException('Tagihan ini sudah lunas.');
    }

    if (jumlah_bayar < tagihan.total_tagihan) {
        throw new BadRequestException(`Jumlah bayar (${jumlah_bayar}) kurang dari total tagihan (${tagihan.total_tagihan}).`);
    }

    // 2. Gunakan Transaksi Prisma
    // Ini memastikan kedua operasi (membuat pembayaran DAN update tagihan)
    // berhasil atau gagal bersama-sama.
    return this.prisma.$transaction(async (prisma) => {
      // Operasi Pertama: Buat record pembayaran baru
      const pembayaran = await prisma.pembayaran.create({
        data: {
          tagihanId,
          jumlah_bayar,
          metode_pembayaran,
          dicatatOlehId: kasirId, // Simpan ID kasir yang mencatat
        },
      });

      // Operasi Kedua: Update status tagihan menjadi LUNAS
      const updatedTagihan = await prisma.tagihan.update({
        where: { id: tagihanId },
        data: { status_pembayaran: StatusPembayaran.LUNAS },
      });

      this.logPembayaran(pembayaran, updatedTagihan);
      return pembayaran;
    });
  }

  // Fungsi helper untuk logging (opsional tapi bagus untuk dimiliki)
  private logPembayaran(pembayaran: any, tagihan: any) {
    console.log(`Pembayaran ${pembayaran.id} sebesar ${pembayaran.jumlah_bayar} berhasil dicatat untuk tagihan ${tagihan.nomor_tagihan}. Status tagihan sekarang LUNAS.`);
  }
}