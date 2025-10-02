// backend/src/tagihan/tagihan.controller.ts (FINAL & CLEANED)
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { TagihanService } from './tagihan.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role, StatusPembayaran } from '@prisma/client';

@Controller('tagihan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagihanController {
  constructor(private readonly tagihanService: TagihanService) {}

  // Endpoint untuk memicu pembuatan tagihan secara manual (hanya ADMIN)
  // Menggunakan POST karena ini adalah aksi yang menciptakan resource
  @Post('generate')
  @Roles(Role.ADMIN)
  async generateInvoices() {
    return this.tagihanService.generateInvoices();
  }

  // Endpoint untuk mendapatkan semua tagihan (hanya ADMIN) atau tagihan sendiri (WARGA)
  @Get()
  @Roles(Role.ADMIN, Role.WARGA)
  findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('status') status?: StatusPembayaran,
  ) {
    const user = req.user;
    if (user.role === Role.WARGA) {
      // Jika user adalah WARGA, paksa filter berdasarkan wargaId mereka
      return this.tagihanService.findAll(page, pageSize, status, user.wargaId);
    }
    // Jika ADMIN, bisa melihat semua
    return this.tagihanService.findAll(page, pageSize, status);
  }

  // Endpoint untuk mendapatkan detail satu tagihan
  @Get(':id')
  @Roles(Role.ADMIN, Role.WARGA)
  async findOne(@Param('id') id: string, @Request() req) {
    const user = req.user;
    const tagihan = await this.tagihanService.findOne(id);

    // Jika user adalah WARGA, pastikan mereka hanya bisa melihat tagihan mereka sendiri
    if (user.role === Role.WARGA && tagihan.wargaId !== user.wargaId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke tagihan ini.');
    }

    return tagihan;
  }
}
