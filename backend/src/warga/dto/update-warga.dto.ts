// backend/src/warga/dto/update-warga.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateWargaDto } from './create-warga.dto';

// DTO ini akan memiliki semua field dari CreateWargaDto,
// tetapi semuanya bersifat opsional.
export class UpdateWargaDto extends PartialType(CreateWargaDto) {}