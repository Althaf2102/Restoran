import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePesananDto } from './DTO/create-pesanan.dto';
import { updatePesananDto } from './DTO/update-pesanan.dto';
import { MetodePembayaran, StatusPembayaran } from '@prisma/client';


@Injectable()
export class PesananService {
  constructor(private prisma: PrismaService) {}

  
  private generateKodePesanan(): string {
    const tanggal = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${tanggal}-${random}`;
  }

  async create(dto: CreatePesananDto, pelangganId?: number) {
  const menuIds = dto.items.map((item) => item.menuId);
  const menus = await this.prisma.menu.findMany({
    where: { id: { in: menuIds }, tersedia: true },
  });

  if (menus.length !== menuIds.length) {
    throw new BadRequestException(
      'Beberapa menu tidak ditemukan atau tidak tersedia',
    );
  }

  const detailData = dto.items.map((item) => {
    const menu = menus.find((m) => m.id === item.menuId);
    if (!menu) throw new BadRequestException(`Menu ID ${item.menuId} tidak ditemukan`);
    const harga_saat_ini = Number(menu.harga);
    const subtotal = harga_saat_ini * item.jumlah;
    return {
      menuId:       item.menuId,
      jumlah:       item.jumlah,
      harga_saat_ini: harga_saat_ini,
      subtotal:     subtotal,
    };
  });

  const totalHarga = detailData.reduce((sum, d) => sum + d.subtotal, 0);

  // 1. LOGIKA PENENTUAN STATUS PEMBAYARAN BARU DI SINI
  // Membaca metode dari dto frontend. Jika memilih QRIS otomatis LUNAS, jika TUNAI otomatis BELUM_LUNAS
  const penentuanStatus = dto.metodePembayaran === 'QRIS' ? StatusPembayaran.LUNAS : StatusPembayaran.BELUM_LUNAS;

  // PROSES SIMPAN KE DATABASE
  const pesanan = await this.prisma.$transaction(async (tx) => {
    return tx.pesanan.create({
      data: {
        kode_pesanan:   this.generateKodePesanan(),
        nama_pelanggan: dto.namaPelanggan,
        catatan:        dto.catatan,
        totalHarga:     totalHarga,
        pelangganId:    pelangganId ?? null,
        
        // Hubungkan ke Detail Pesanan
        detail: {
          create: detailData,
        },

        // 2. DI SINI PENYESUAIAN PADA TABEL PEMBAYARAN
        pembayaran: {
          create: {
            metode:     (dto.metodePembayaran as MetodePembayaran) || MetodePembayaran.TUNAI, 
            totalBayar: totalHarga, 
            kembalian:  0,
            status:     penentuanStatus,  
          }as any
        }
      },
      include: {
        detail: {
          include: { menu: true },
        },
        pembayaran: true, 
      },
    });
  });

  return pesanan;
}

 


  async findAll() {
    return this.prisma.pesanan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        pembayaran: true,
        detail: {
          include: { menu: true },
        },
      },
    });
  }

 
  async findByKode(kode: string) {
    const pesanan = await this.prisma.pesanan.findUnique({
      where: { kode_pesanan: kode },
      include: {
        detail: {
          include: { menu: true },
        },
      },
    });

    if (!pesanan) throw new NotFoundException(`Pesanan ${kode} tidak ditemukan`);
    return pesanan;
  }


  async update(id: number, dto: updatePesananDto) {
    await this.findById(id);
    return this.prisma.pesanan.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  private async findById(id: number) {
    const pesanan = await this.prisma.pesanan.findUnique({ where: { id } });
    if (!pesanan) throw new NotFoundException(`Pesanan dengan ID ${id} tidak ditemukan`);
    return pesanan;
  }
}