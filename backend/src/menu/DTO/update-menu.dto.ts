import { IsEnum,IsInt,IsOptional,IsNotEmpty,IsString,Min, IsIn,IsBoolean,IsNumber } from "class-validator";
import { KategoriMenu } from "@prisma/client";
import { Type } from "class-transformer";

export class updateMenudto {
@IsString()
@IsNotEmpty()
@IsOptional()
nama_menu ?:string;


@IsEnum(KategoriMenu)
@IsOptional()
kategori ?: KategoriMenu;

@IsString()
@IsNotEmpty()
@IsOptional()
deskripsi ? : string;

@Type(()=>Number)
@IsNumber({},{ message:'angka harus desimal'})
@IsNotEmpty()
@IsOptional()
harga ?: number;

@Type(() => Number)
@IsInt()
@IsOptional()
stok?: number;

@Type(() => Boolean)
@IsBoolean()
@IsOptional()
tersedia ?: boolean;




}