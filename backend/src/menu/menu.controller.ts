// src/menu/menu.controller.ts
import {
  Controller,Get,Post,Patch,Delete,Param,Body,Query,ParseIntPipe,UseGuards,} from '@nestjs/common';
import { MenuService } from './menu.service';
import { createMenudto } from './DTO/create-menu.dto';
import { updateMenudto } from './DTO/update-menu.dto';
import { KategoriMenu } from '@prisma/client';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {extname} from 'path';

@ApiTags('menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(@Query('kategori') kategori?: KategoriMenu) {
    return this.menuService.findAll(kategori);
  }

  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Post()
@UseInterceptors(
  FileInterceptor('foto', {
    storage: diskStorage({
      // 1. Tentukan folder tujuan penyimpanan file gambar di backend
      destination: './uploads', 
      filename: (req, file, callback) => {
        // 2. Buat nama file unik agar tidak bentrok (contoh: 1717400000-836482.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async create(
  @Body() dto: createMenudto,
  @UploadedFile() file: Express.Multer.File,
) {
  // Sekarang file.filename DIJAMIN ada nilainya dan tidak akan undefined lagi!
  dto.foto = file ? file.filename : null; 
  
  return this.menuService.create(dto);
}
 

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Patch(':id')
@UseInterceptors(FileInterceptor('foto'))  // ← tambahkan ini
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: updateMenudto,
  @UploadedFile() file?: Express.Multer.File,  // ← tambahkan ini
) {
  if (file) dto.foto = file.filename;
  return this.menuService.update(id, dto);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}