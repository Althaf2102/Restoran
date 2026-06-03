import { Injectable, NotFoundException } from '@nestjs/common';
import { createMenudto } from './DTO/create-menu.dto';
import { updateMenudto } from './DTO/update-menu.dto';
import { KategoriMenu } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class MenuService {
    constructor(private prisma: PrismaService) {}

    async create(dto: createMenudto) {
  return this.prisma.menu.create({
    data: {
      nama_menu: dto.nama_menu,
      kategori:  dto.kategori,
      deskripsi: dto.deskripsi,
      harga:     dto.harga,
      foto:      dto.foto,
      tersedia:  dto.tersedia ?? true,
      stok:      dto.stok,
    },
  });
}
    
    async findAll (kategori? : KategoriMenu)  {
        return this.prisma.menu.findMany({
            where : {
                tersedia : true,
                ...(kategori && {kategori})
            },
            orderBy : {createdAt: 'desc'}
        })
    }
    
    async findOne (id:number) {
     const menu = await this.prisma.menu.findUnique({ where: {id}})
     if  (!menu) throw new NotFoundException ("Menu Tidak Ditemukan")
        return menu;
    
    }
    
async update(id: number, dto: updateMenudto) {
 
  const menuLama = await this.findOne(id);
  const namaFoto = dto.foto ? dto.foto : menuLama.foto;
  return this.prisma.menu.update({
    where: { id },
    data: {
      ...dto,
      foto: namaFoto,
    },
  });
}
    
async remove(id: number) {
    await this.findOne(id);
    await this.prisma.menu.delete({
    where: { id },
  });
return { message: `Menu dengan ID ${id} telah berhasil dihapus` };
}
}
