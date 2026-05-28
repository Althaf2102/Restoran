import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsInt } from "class-validator";
import { Type } from "class-transformer";

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
}