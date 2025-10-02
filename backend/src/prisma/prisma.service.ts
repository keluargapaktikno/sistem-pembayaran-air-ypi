// backend/src/prisma/prisma.service.ts (KODE LENGKAP)

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Method ini akan dipanggil secara otomatis saat modul diinisialisasi
  async onModuleInit() {
    // Menghubungkan Prisma Client ke database
    await this.$connect();
  }
}