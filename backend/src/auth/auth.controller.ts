// backend/src/auth/auth.controller.ts (KODE LENGKAP)

import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Akan kita buat setelah ini
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint untuk login
  // Kita tidak menggunakan guard di sini karena ini adalah public endpoint
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validasi user dilakukan secara manual di service
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  // Endpoint ini dilindungi oleh JwtAuthGuard
  // Hanya request dengan token JWT yang valid yang bisa mengaksesnya
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}