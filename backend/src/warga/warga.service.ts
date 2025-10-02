// backend/src/warga/warga.service.ts (KODE LENGKAP)

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWargaDto } from './dto/create-warga.dto';
import { UpdateWargaDto } from './dto/update-warga.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class WargaService {
  constructor(private prisma: PrismaService) {}

  // Membuat Warga baru sekaligus User login-nya dalam satu transaksi
  async create(createWargaDto: CreateWargaDto) {
    const { email, password, nama_lengkap, ...wargaData } = createWargaDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Menggunakan transaksi Prisma untuk memastikan kedua operasi berhasil atau gagal bersamaan
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Cek dulu apakah email sudah ada (hindari error P2002 dan berikan response yang lebih ramah)
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
          throw new ConflictException('Email already in use');
        }

        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            nama: nama_lengkap, // Nama user diambil dari nama lengkap warga
            role: Role.WARGA, // Setiap warga baru otomatis memiliki role WARGA
          },
        });

        const newWarga = await prisma.warga.create({
          data: {
            ...wargaData,
            nama_lengkap,
            userId: newUser.id, // Menghubungkan warga dengan user yang baru dibuat
          },
          include: {
            user: {
              select: { id: true, email: true, nama: true, role: true },
            },
          },
        });

        return newWarga;
      });
    } catch (err) {
      // Jika Prisma melempar error unique constraint (mis. race condition), konversi jadi HTTP 409
      if ((err as Prisma.PrismaClientKnownRequestError)?.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw err;
    }
  }

  // Menampilkan semua data warga dengan pagination
  async findAll(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.warga.findMany({
        skip,
        take,
        orderBy: { nama_lengkap: 'asc' },
        include: { user: { select: { email: true, nama: true } } },
      }),
      this.prisma.warga.count(),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // Menampilkan satu data warga berdasarkan ID
  async findOne(id: string) {
    const warga = await this.prisma.warga.findUnique({
      where: { id },
      include: { user: { select: { email: true, nama: true, role: true }}}
    });

    if (!warga) {
      throw new NotFoundException(`Warga with ID ${id} not found`);
    }
    return warga;
  }

  // Memperbarui data warga
  async update(id: string, updateWargaDto: UpdateWargaDto) {
    // Cek dulu apakah warga ada
    await this.findOne(id);
    return this.prisma.warga.update({
      where: { id },
      data: updateWargaDto,
    });
  }

  // Menghapus data warga
  async remove(id: string) {
    // Cek dulu apakah warga ada
    await this.findOne(id);
    // Menghapus User akan otomatis menghapus Warga karena `onDelete: Cascade` di skema
    const warga = await this.prisma.warga.findUnique({ where: { id }});
    if (!warga) {
      throw new NotFoundException(`Warga with ID ${id} not found`);
    }
    await this.prisma.user.delete({ where: { id: warga.userId }});
    return { message: `Warga with ID ${id} and associated user have been deleted.` };
  }
}