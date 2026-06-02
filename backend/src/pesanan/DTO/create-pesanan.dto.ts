import { Type } from "class-transformer";
import { IsInt, IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from "class-validator";

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

  @IsString()
  @IsNotEmpty()
  metodePembayaran!: string; // Cukup terima string 'TUNAI' / 'QRIS' dari frontend
}