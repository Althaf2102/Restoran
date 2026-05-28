import { KategoriMenu } from "@prisma/client";
export type menu = {
    id : number;
    nama_menu : string;
    kategori : KategoriMenu;
    deskripsi : string;
    harga : number;
    foto : string;
    stok : number;
}