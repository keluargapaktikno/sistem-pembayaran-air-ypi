// backend/src/prisma/prisma.module.ts (KODE LENGKAP)

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <- Tambahkan decorator @Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <- Ekspor service agar bisa di-inject di modul lain
})
export class PrismaModule {}