// backend/src/users/users.service.ts (KODE LENGKAP)

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Method untuk membuat user baru
  async create(createUserDto: CreateUserDto) {
    const { email, password, nama, role } = createUserDto;

    // Hash password sebelum disimpan ke database
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nama,
        role,
      },
    });

    // Hapus password dari objek yang dikembalikan demi keamanan
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Method untuk mencari user berdasarkan email
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}