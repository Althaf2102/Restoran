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
@UseInterceptors(FileInterceptor('foto'))
async createMenu(
  @Body() dto: createMenudto, 
  @UploadedFile() file: Express.Multer.File
) {
  // Masukkan nama file yang disimpan oleh multer ke properti dto.foto
  dto.foto = file ? file.filename : null; 
  
  // Kirim dto yang sudah tervalidasi dan bersih ke service
  return this.menuService.create(dto);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Patch(':id')
@UseInterceptors(FileInterceptor('foto')) 
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
  remove(@Param('id', ParseIntPipe) id: number) {{
    return this.menuService.remove(id);
  }
  }}