import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, IsEnum ,IsInt} from 'class-validator';
import { Type } from 'class-transformer';
import { MetodePembayaran } from '@prisma/client';

export class DetailPesananDto {
  @IsInt()
  menuId!: number;

  @IsInt()
  jumlah!: number;
}

export class CreatePesananDto {
  @IsString()
  @IsNotEmpty()
  namaPelanggan!: string;

  @IsString()
  @IsOptional()
  catatan?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailPesananDto)
  items!: DetailPesananDto[];

  @IsEnum(MetodePembayaran)
  @IsNotEmpty()
  metodePembayaran!: MetodePembayaran; 
}