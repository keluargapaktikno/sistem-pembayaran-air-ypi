import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; // 1. Impor ScheduleModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WargaModule } from './warga/warga.module';
import { PencatatanMeterModule } from './pencatatan-meter/pencatatan-meter.module';
import { TagihanModule } from './tagihan/tagihan.module';
import { PembayaranModule } from './pembayaran/pembayaran.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(), // 2. Tambahkan ScheduleModule.forRoot()
    PrismaModule,
    UsersModule,
    AuthModule, 
    WargaModule,
    PencatatanMeterModule,
    TagihanModule,
    PembayaranModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}