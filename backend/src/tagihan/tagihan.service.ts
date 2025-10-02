// backend/src/tagihan/tagihan.service.ts (DENGAN CRON JOB)
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagihanService {
  private readonly logger = new Logger(TagihanService.name);

  constructor(private prisma: PrismaService) {}

  // Cron job yang berjalan setiap hari jam 1 pagi (01:00)
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleGenerateInvoicesCron() {
    this.logger.log('Mulai menjalankan cron job untuk generate tagihan...');
    const result = await this.generateInvoices();
    this.logger.log(result.message);
  }

  // Logika utama untuk generate invoices
  async generateInvoices() {
    const pencatatanTanpaTagihan = await this.prisma.pencatatanMeter.findMany({
      where: {
        tagihan: null,
      },
    });

    if (pencatatanTanpaTagihan.length === 0) {
      return { message: 'Tidak ada pencatatan baru yang perlu dibuatkan tagihan.' };
    }

    const invoices = [];
    for (const pencatatan of pencatatanTanpaTagihan) {
      const tarifPerM3 = 5000;
      const biayaAbonemen = 10000;
      const totalTagihan = pencatatan.pemakaian * tarifPerM3 + biayaAbonemen;
      const nomorTagihan = `INV-${Date.now()}-${pencatatan.id.slice(-6)}`;
      const tanggalJatuhTempo = new Date(pencatatan.periode_pencatatan);
      tanggalJatuhTempo.setDate(tanggalJatuhTempo.getDate() + 20); // Jatuh tempo tanggal 20 bulan berikutnya

      const newInvoice = await this.prisma.tagihan.create({
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
      });
      invoices.push(newInvoice);
    }

    return {
      message: `Cron job selesai. Berhasil generate ${invoices.length} tagihan baru.`,
      invoices,
    };
  }

  // Mendapatkan semua tagihan dengan paginasi dan filter
  async findAll(
    page: number,
    pageSize: number,
    status?: string,
    wargaId?: string, // Tambahkan parameter wargaId opsional
  ) {
    const whereClause: any = {};
    if (status) {
      whereClause.status_pembayaran = status;
    }
    // Jika wargaId diberikan, tambahkan ke klausa where
    if (wargaId) {
      whereClause.wargaId = wargaId;
    }

    const totalItems = await this.prisma.tagihan.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / pageSize);

    const tagihan = await this.prisma.tagihan.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        warga: {
          select: { nama_lengkap: true, blok: true, nomor_rumah: true },
        },
      },
      orderBy: {
        periode_tagihan: 'desc',
      }
    });

    return {
      data: tagihan,
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: string) {
    const tagihan = await this.prisma.tagihan.findUnique({
      where: { id },
      include: {
        warga: true,
        pembayaran: true,
      },
    });
    if (!tagihan) {
      throw new Error('Tagihan tidak ditemukan');
    }
    return tagihan;
  }
}