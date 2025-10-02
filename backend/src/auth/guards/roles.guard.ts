// backend/src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Mengambil roles yang diizinkan dari decorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada roles yang disyaratkan, izinkan akses
    if (!requiredRoles) {
      return true;
    }

    // Mengambil data user dari request (yang sudah divalidasi oleh JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Cek apakah role user ada di dalam daftar roles yang diizinkan
    // user.role adalah satu nilai enum, bukan array; bandingkan langsung
    return requiredRoles.includes(user.role);
  }
}