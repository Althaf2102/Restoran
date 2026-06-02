import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsInt,IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { StatusPembayaran } from "@prisma/client";

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
  @Type(() => DetailPesananDto)  // ← ini penting agar items ter-transform
  items!: DetailPesananDto[];

  @IsOptional() // Opsional karena sudah ada default 'BELUM_LUNAS' di database
  @IsEnum(StatusPembayaran)
  pembayaran?: StatusPembayaran;
}