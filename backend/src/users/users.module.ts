// backend/src/users/users.module.ts (KODE LENGKAP & BENAR)

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // <- Pastikan Controller di-impor

@Module({
  controllers: [UsersController], // <- Pastikan Controller ada di sini
  providers: [UsersService],
  exports: [UsersService], // <- Kita ekspor service agar bisa dipakai di AuthModule
})
export class UsersModule {}