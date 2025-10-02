// backend/src/pencatatan-meter/pencatatan-meter.controller.ts (KODE LENGKAP)
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PencatatanMeterService } from './pencatatan-meter.service';
import { CreatePencatatanDto } from './dto/create-pencatatan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pencatatan-meter')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PencatatanMeterController {
  constructor(private readonly pencatatanMeterService: PencatatanMeterService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PETUGAS_PENCATAT)
  create(@Body() createPencatatanDto: CreatePencatatanDto, @Request() req) {
    const petugasId = req.user.id; // Ambil ID user dari token JWT
    return this.pencatatanMeterService.create(createPencatatanDto, petugasId);
  }
}