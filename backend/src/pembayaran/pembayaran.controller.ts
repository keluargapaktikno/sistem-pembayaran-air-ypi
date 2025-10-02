// backend/src/pembayaran/pembayaran.controller.ts (KODE LENGKAP)
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PembayaranService } from './pembayaran.service';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pembayaran')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PembayaranController {
  constructor(private readonly pembayaranService: PembayaranService) {}

  @Post()
  @Roles(Role.ADMIN) // Hanya Admin/Kasir yang bisa mencatat pembayaran
  create(@Body() createPembayaranDto: CreatePembayaranDto, @Request() req) {
    const kasirId = req.user.id; // Ambil ID Kasir dari token JWT
    return this.pembayaranService.create(createPembayaranDto, kasirId);
  }
}