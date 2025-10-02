import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTagihan() {
    return this.prisma.tagihan.findMany({
      include: {
        warga: {
          select: {
            nama_lengkap: true,
            blok: true,
            nomor_rumah: true,
          },
        },
      },
      orderBy: {
        periode_tagihan: 'desc',
      },
    });
  }
}