// backend/src/warga/dto/create-warga.dto.ts

import { StatusHuni } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateWargaDto {
  @IsString()
  @IsNotEmpty()
  nama_lengkap: string;

  @IsString()
  @IsNotEmpty()
  blok: string;

  @IsString()
  @IsNotEmpty()
  nomor_rumah: string;

  @IsString()
  @IsNotEmpty()
  nomor_telepon: string;

  @IsEnum(StatusHuni)
  @IsNotEmpty()
  status_huni: StatusHuni;

  // Data untuk membuat User login sekaligus
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}