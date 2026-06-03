import { IsEnum,IsInt,IsOptional,IsNotEmpty,IsString,Min, IsIn,IsNumber,IsBoolean, } from "class-validator";
import { KategoriMenu } from "@prisma/client";
import { Type } from "class-transformer";


export class createMenudto {
@IsString()
@IsNotEmpty()
nama_menu !:string;


@IsEnum(KategoriMenu)
kategori !: KategoriMenu;

@IsString()
@IsNotEmpty()
deskripsi ! : string;

@Type(()=>Number)
@IsNumber({},{ message:'angka harus desimal'})
@IsNotEmpty()
harga !: number;


@IsOptional()
foto ? : any;

@Type(()=>Number)
@IsInt()
@IsNotEmpty()
stok !: number;

@Type(() => Boolean)
@IsBoolean()
@IsOptional()
tersedia ?: boolean;



}