// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './DTO/login.dto';
import { RegisterDto } from './DTO/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // cek email sudah terdaftar atau belum
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        nama:     dto.nama,
        email:    dto.email,
        password: hashedPassword,
        role:     dto.role ?? 'pelanggan',
      },
    });

    return { message: 'Registrasi berhasil', userId: user.id };
  }

  async login( dto: LoginDto) {
    // cari user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    // validasi password
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Password salah');

   const payload = {
  sub: user.id,
  email: user.email,
  role: user.role
};

return {
  access_token: this.jwtService.sign(payload),
  user: {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
  },
};
  }}