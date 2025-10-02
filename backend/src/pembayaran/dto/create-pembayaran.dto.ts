// backend/src/pembayaran/dto/create-pembayaran.dto.ts
import { MetodePembayaran } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePembayaranDto {
  @IsString()
  @IsNotEmpty()
  tagihanId: string;

  @IsEnum(MetodePembayaran)
  @IsNotEmpty()
  metode_pembayaran: MetodePembayaran;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  jumlah_bayar: number;
}