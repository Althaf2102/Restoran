import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetodePembayaran, StatusPembayaran } from '@prisma/client';

export class UpdatePembayaranDto {
  @IsNotEmpty({ message: 'ID Pesanan wajib diisi' })
  @IsNumber({}, { message: 'ID Pesanan harus berupa angka' })
  pesananId!: number;

  @IsNotEmpty({ message: 'Metode pembayaran wajib diisi' })
  @IsEnum(MetodePembayaran, { 
    message: 'Metode pembayaran harus berupa TUNAI, QRIS, atau TRANSFER_BANK' 
  })
  metode?: MetodePembayaran;

  @IsNotEmpty({ message: 'Total bayar wajib diisi' })
  // Diubah ke IsNumber jika di Swagger diinput angka biasa tanpa kutip
  @IsNumber({}, { message: 'Total bayar harus berupa angka' }) 
  totalBayar?: number;

  // 1. TAMBAHKAN PROPERTY INI AGAR SWAGGER & NESTJS BISA MEMBACA INPUT STATUS
  @IsNotEmpty({ message: 'Status pembayaran wajib diisi' })
  @IsEnum(StatusPembayaran, {
    message: 'Status pembayaran harus berupa BELUM_LUNAS atau LUNAS'
  })
  statusPembayaran?: StatusPembayaran;
}