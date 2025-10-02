import { Module } from '@nestjs/common';
import { WargaController } from './warga.controller';
import { WargaService } from './warga.service';

@Module({
  controllers: [WargaController],
  providers: [WargaService]
})
export class WargaModule {}
