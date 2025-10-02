// backend/src/tagihan/tagihan.module.ts
import { Module } from '@nestjs/common';
import { GenerateInvoicesController, TagihanController } from './tagihan.controller';
import { TagihanService } from './tagihan.service';

@Module({
  controllers: [TagihanController, GenerateInvoicesController],
  providers: [TagihanService],
})
export class TagihanModule {}