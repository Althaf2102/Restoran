// src/menu/menu.controller.ts
import {
  Controller,Get,Post,Patch,Delete,Param,Body,Query,ParseIntPipe,UseGuards,} from '@nestjs/common';
import { MenuService } from './menu.service';
import { createMenudto } from './DTO/create-menu.dto';
import { updateMenudto } from './DTO/update-menu.dto';
import { KategoriMenu } from '@prisma/client';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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
@Post()                                    // ← pastikan ini ada
@UseInterceptors(FileInterceptor('foto'))
create(
  @Body() dto: createMenudto,
  @UploadedFile() file: Express.Multer.File
) {
  dto.foto = file?.filename;
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