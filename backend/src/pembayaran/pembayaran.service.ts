// src/pembayaran/pembayaran.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembayaranDto } from './DTO/create-pembayaran.dto';
import { UpdatePembayaranDto } from './DTO/update-pembayaran.dto';
import { StatusPembayaran, StatusPesanan } from '@prisma/client';

@Injectable()
export class PembayaranService {
  constructor(private prisma: PrismaService) {}

  // 1. PROSES BAYAR (Create Pembayaran)
async create(dto: CreatePembayaranDto) {
  // Ambil data pesanan beserta riwayat pembayaran (jika ada)
  const pesanan = await this.prisma.pesanan.findUnique({
    where: { id: dto.pesananId },
    include: { pembayaran: true },
  });

  // VALIDASI 1: Apakah pesanannya ada di database?
  if (!pesanan) {
    throw new NotFoundException(`Pesanan dengan ID ${dto.pesananId} tidak ditemukan`);
  }

  // VALIDASI 2: JIKA SUDAH LUNAS (Status = diproses / sudah ada data pembayaran)
  // Ini jawaban dari pertanyaan Anda: Sistem menolak jika pelanggan mencoba bayar lagi
  if (pesanan.status === StatusPesanan.diproses || pesanan.pembayaran) {
    throw new BadRequestException('Pesanan ini sudah lunas! Pelanggan tidak perlu membayar lagi.');
  }

  // VALIDASI 3: Jika pesanan sudah dibatalkan
  if (pesanan.status === StatusPesanan.dibatalkan) {
    throw new BadRequestException('Pesanan ini sudah dibatalkan, tidak bisa diproses pembayaran!');
  }

  // VALIDASI 4: JIKA BELUM LUNAS -> Cek apakah uangnya cukup?
  const totalHarga = Number(pesanan.totalHarga);
  if (dto.totalBayar < totalHarga) {
    throw new BadRequestException(
      `Uang tidak cukup! Total tagihan: Rp ${totalHarga.toLocaleString('id-ID')}, Uang diterima: Rp ${dto.totalBayar.toLocaleString('id-ID')}`
    );
  }

  // JIKA SEMUA VALIDASI AMAN -> JALANKAN PROSES PEMBAYARAN
  const kembalian = dto.totalBayar - totalHarga;

  return this.prisma.$transaction(async (tx) => {
    // a. Catat transaksi di tabel pembayaran
    const pembayaranBaru = await tx.pembayaran.create({
      data: {
        pesananId: dto.pesananId,
        metode: dto.metode,
        totalBayar: dto.totalBayar,
        kembalian: kembalian,
      },
    });

    // b. Ubah status pesanan dari PENDING menjadi DIPROSES (Lunas)
    await tx.pesanan.update({
      where: { id: dto.pesananId },
      data: { status: StatusPesanan.diproses },
    });

    return {
      message: 'Pembayaran berhasil! Status pesanan kini diperbarui menjadi LUNAS (DIPROSES).',
      detail: pembayaranBaru
    };
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

    // Konversi totalHarga dari DB (String) ke Number untuk dihitung
    const totalHarga = Number(pesanan.totalHarga);
    
    // Konversi input dto.totalBayar ke Number agar bisa dibandingkan dan dikurangi
    const totalBayarNum = Number(dto.totalBayar);

    if (totalBayarNum < totalHarga) {
      throw new BadRequestException('Total bayar yang baru kurang dari total harga pesanan!');
    }
    
    kembalian = totalBayarNum - totalHarga;
  }

  // Jalankan update ke database
  return this.prisma.pembayaran.update({
    where: { id },
    data: {
      metode: dto.metode,
      // Kita kembalikan ke String menggunakan .toString() agar sesuai tipe data DB kamu
      totalBayar: dto.totalBayar ? dto.totalBayar.toString() : pembayaranExist.totalBayar,
      kembalian: kembalian.toString(), 
      
      // INI YANG TADI HILANG:
      statusPembayaran: dto.statusPembayaran, 
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