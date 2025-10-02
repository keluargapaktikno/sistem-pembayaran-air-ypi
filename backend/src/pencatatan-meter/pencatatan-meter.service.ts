// backend/src/pencatatan-meter/pencatatan-meter.service.ts (KODE LENGKAP)
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePencatatanDto } from './dto/create-pencatatan.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PencatatanMeterService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePencatatanDto, petugasId: string) {
    // Cek apakah warga ada
    const warga = await this.prisma.warga.findUnique({
      where: { id: dto.wargaId },
    });
    if (!warga) {
      throw new NotFoundException(
        `Warga dengan ID ${dto.wargaId} tidak ditemukan.`,
      );
    }

    // Tentukan periode sebelumnya
    const periodeSekarang = new Date(dto.periode_pencatatan);
    const periodeSebelumnya = new Date(periodeSekarang);
    periodeSebelumnya.setMonth(periodeSebelumnya.getMonth() - 1);

    // Cari pencatatan terakhir untuk mendapatkan meter_awal
    const pencatatanTerakhir = await this.prisma.pencatatanMeter.findFirst({
      where: { wargaId: dto.wargaId },
      orderBy: { periode_pencatatan: 'desc' },
    });

    const meter_awal = pencatatanTerakhir ? pencatatanTerakhir.meter_akhir : 0;
    const pemakaian = dto.meter_akhir - meter_awal;

    if (pemakaian < 0) {
      throw new BadRequestException(
        `Meter akhir (${dto.meter_akhir}) tidak boleh lebih kecil dari meter awal (${meter_awal}).`,
      );
    }

    try {
      return await this.prisma.pencatatanMeter.create({
        data: {
          wargaId: dto.wargaId,
          periode_pencatatan: periodeSekarang,
          meter_awal,
          meter_akhir: dto.meter_akhir,
          pemakaian,
          petugasId,
          foto_meter: undefined,
        },
      });
    } catch (err) {
      if ((err as Prisma.PrismaClientKnownRequestError)?.code === 'P2002') {
        throw new ConflictException('Pencatatan untuk periode ini sudah ada.');
      }
      throw err;
    }
  }
}