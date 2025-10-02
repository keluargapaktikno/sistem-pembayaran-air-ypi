import { Module } from '@nestjs/common';
import { PencatatanMeterController } from './pencatatan-meter.controller';
import { PencatatanMeterService } from './pencatatan-meter.service';

@Module({
  controllers: [PencatatanMeterController],
  providers: [PencatatanMeterService]
})
export class PencatatanMeterModule {}
