// backend/src/pencatatan-meter/dto/create-pencatatan.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePencatatanDto {
  @IsString()
  @IsNotEmpty()
  wargaId: string;

  @IsDateString()
  @IsNotEmpty()
  periode_pencatatan: string; // Format "YYYY-MM-DD"

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  meter_akhir: number;
}
