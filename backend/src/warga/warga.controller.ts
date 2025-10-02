// backend/src/warga/warga.controller.ts (KODE LENGKAP)

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { WargaService } from './warga.service';
import { CreateWargaDto } from './dto/create-warga.dto';
import { UpdateWargaDto } from './dto/update-warga.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

// Semua endpoint di controller ini akan dilindungi oleh JWT dan Roles Guard
@Controller('warga')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WargaController {
  constructor(private readonly wargaService: WargaService) {}

  // Endpoint untuk membuat warga baru
  // Hanya bisa diakses oleh ADMIN
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createWargaDto: CreateWargaDto) {
    return this.wargaService.create(createWargaDto);
  }

  // Endpoint untuk melihat semua warga
  // Bisa diakses oleh ADMIN dan PETUGAS_PENCATAT
  @Get()
  @Roles(Role.ADMIN, Role.PETUGAS_PENCATAT)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return this.wargaService.findAll(page, pageSize);
  }

  // Endpoint untuk melihat detail satu warga
  // Bisa diakses oleh ADMIN dan PETUGAS_PENCATAT
  @Get(':id')
  @Roles(Role.ADMIN, Role.PETUGAS_PENCATAT)
  findOne(@Param('id') id: string) {
    return this.wargaService.findOne(id);
  }

  // Endpoint untuk update data warga
  // Hanya bisa diakses oleh ADMIN
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateWargaDto: UpdateWargaDto) {
    return this.wargaService.update(id, updateWargaDto);
  }

  // Endpoint untuk menghapus warga
  // Hanya bisa diakses oleh ADMIN
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.wargaService.remove(id);
  }
}