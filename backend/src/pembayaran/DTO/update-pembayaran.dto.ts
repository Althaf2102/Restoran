import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { MetodePembayaran } from '@prisma/client';

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
  @IsNumber({}, { message: 'Total bayar harus berupa angka' })
  @IsPositive({ message: 'Total bayar tidak boleh minus atau nol' })
  totalBayar?: number;
}