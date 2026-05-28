
import { IsEnum,IsString, IsOptional, IsInt, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePesananDto, DetailPesananDto } from './create-pesanan.dto';
import { StatusPesanan } from '@prisma/client';

export class updatePesananDto {
  @IsString()
  @IsNotEmpty()
  kode_pesanan?: string;

  @IsInt()
  @IsOptional()
  pelangganId?: number;

  @IsString()
  @IsOptional()
  nama_pelanggan?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalHarga?: number;

  @IsString()
  @IsOptional()
  catatan?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailPesananDto)
  detail?: DetailPesananDto[]; 

  @IsEnum(StatusPesanan)
  @IsOptional()
  status? : StatusPesanan;
}