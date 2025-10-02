// backend/src/tagihan/tagihan.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { TagihanService } from './tagihan.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tagihan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagihanController {
  constructor(private readonly tagihanService: TagihanService) {}

  // Endpoint untuk generate invoices (hanya ADMIN)
  @Get('generate-invoices')
  @Roles(Role.ADMIN)
  async generateInvoices() {
    return this.tagihanService.generateInvoices();
  }

  // Endpoint untuk mendapatkan semua tagihan
  @Get()
  async getAllTagihan() {
    return this.tagihanService.getAllTagihan();
  }
}

@Controller('generate-invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GenerateInvoicesController {
  constructor(private readonly tagihanService: TagihanService) {}

  @Get()
  @Roles(Role.ADMIN)
  async generateInvoices() {
    return this.tagihanService.generateInvoices();
  }
}
