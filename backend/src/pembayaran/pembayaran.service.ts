// src/pembayaran/pembayaran.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembayaranDto } from './DTO/create-pembayaran.dto';
import { UpdatePembayaranDto } from './DTO/update-pembayaran.dto';
import { StatusPesanan } from '@prisma/client';

@Injectable()
export class PembayaranService {
  constructor(private prisma: PrismaService) {}

  // 1. PROSES BAYAR (Create Pembayaran)
  async create(dto: CreatePembayaranDto) {
    // Cari data pesanan terlebih dahulu beserta relasi pembayaran yang sudah ada
    const pesanan = await this.prisma.pesanan.findUnique({
      where: { id: dto.pesananId },
      include: { pembayaran: true },
    });

    // Validasi: Apakah pesanan ada?
    if (!pesanan) {
      throw new NotFoundException(`Pesanan dengan ID ${dto.pesananId} tidak ditemukan`);
    }

    // Validasi: Apakah pesanan sudah pernah dibayar?
    if (pesanan.pembayaran) {
      throw new BadRequestException('Pesanan ini sudah dibayar sebelumnya!');
    }

    // Validasi: Apakah pesanan sudah dibatalkan? (Disamakan menjadi UPPERCASE)
    if (pesanan.status === StatusPesanan.dibatalkan) {
      throw new BadRequestException('Pesanan yang sudah dibatalkan tidak bisa dibayar!');
    }

    

    // Validasi: Apakah uang yang dibayarkan cukup?
    const totalHarga = Number(pesanan.totalHarga);
    if (dto.totalBayar < totalHarga) {
      throw new BadRequestException(
        `Uang tidak cukup! Total tagihan adalah Rp ${totalHarga.toLocaleString('id-ID')}, sedangkan uang yang dimasukkan Rp ${dto.totalBayar.toLocaleString('id-ID')}`
      );
    }

    // Hitung kembalian secara aman di backend
    const kembalian = dto.totalBayar - totalHarga;

    // Jalankan transaksi database (All or Nothing)
    return this.prisma.$transaction(async (tx) => {
      // a. Buat data pembayaran baru (Spasi nama variabel sudah diperbaiki)
      const pembayaranBaru = await tx.pembayaran.create({
        data: {
          pesananId: dto.pesananId,
          metode: dto.metode,
          totalBayar: dto.totalBayar,
          kembalian: kembalian,
        },
      });

      // b. Update status pesanan menjadi DIPROSES (Disamakan menjadi UPPERCASE)
      await tx.pesanan.update({
        where: { id: dto.pesananId },
        data: { status: StatusPesanan.diproses },
      });

      return pembayaranBaru;
    });
  }

  // 2. AMBIL SEMUA RIWAYAT PEMBAYARAN
  async findAll() {
    return this.prisma.pembayaran.findMany({
      orderBy: { waktuBayar: 'desc' },
      include: {
        pesanan: true,
      },
    });
  }

  // 3. AMBIL SATU DATA PEMBAYARAN BERDASARKAN ID
  async findOne(id: number) {
    const pembayaran = await this.prisma.pembayaran.findUnique({
      where: { id },
      include: { pesanan: true },
    });

    if (!pembayaran) {
      throw new NotFoundException(`Data pembayaran dengan ID ${id} tidak ditemukan`);
    }

    return pembayaran;
  }

  // 4. UPDATE PEMBAYARAN
  async update(id: number, dto: UpdatePembayaranDto) {
    // Pastikan data pembayarannya ada dulu
    const pembayaranExist = await this.findOne(id);

    // Jika kasir memperbarui total bayar, hitung ulang kembaliannya
    let kembalian = Number(pembayaranExist.kembalian);
    if (dto.totalBayar) {
      const pesanan = await this.prisma.pesanan.findUnique({
        where: { id: pembayaranExist.pesananId }
      });
      
      if (!pesanan) {
        throw new NotFoundException('Pesanan terkait tidak ditemukan');
      }

      const totalHarga = Number(pesanan.totalHarga);
      if (dto.totalBayar < totalHarga) {
        throw new BadRequestException('Total bayar yang baru kurang dari total harga pesanan!');
      }
      kembalian = dto.totalBayar - totalHarga;
    }

    return this.prisma.pembayaran.update({
      where: { id },
      data: {
        metode: dto.metode,
        totalBayar: dto.totalBayar,
        kembalian: kembalian
      },
    });
  }

  // 5. HAPUS PEMBAYARAN
  async remove(id: number) {
    const pembayaran = await this.findOne(id);
    
    return this.prisma.$transaction(async (tx) => {
      // Hapus data pembayaran
      await tx.pembayaran.delete({ where: { id } });

      // Kembalikan status pesanan menjadi PENDING karena pembayarannya dihapus
      await tx.pesanan.update({
        where: { id: pembayaran.pesananId },
        data: { status: StatusPesanan.dibatalkan },
      });

      return { message: `Pembayaran dengan ID ${id} berhasil dihapus, status pesanan kembali PENDING` };
    });
  }
}