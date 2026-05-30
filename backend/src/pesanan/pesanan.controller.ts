// src/pesanan/pesanan.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  ParseIntPipe, 
  Query, 
  UseGuards
} from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { CreatePesananDto } from './DTO/create-pesanan.dto';
import { updatePesananDto } from './DTO/update-pesanan.dto'; // Catatan: perhatikan huruf kecil/besar di DTO-mu
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('pesanan')
@ApiBearerAuth()
@Controller('pesanan')
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  @Post()
  async create(
    @Body() createPesananDto: CreatePesananDto,
    @Query('pelangganId') pelangganId?: string,
  ) {
    const idPelanggan = pelangganId ? parseInt(pelangganId, 10) : undefined;
    return this.pesananService.create(createPesananDto, idPelanggan);
  }
  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles (Role.admin, Role.kasir)
  @Get()
  async findAll() {
    return this.pesananService.findAll();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles (Role.admin, Role.kasir)
  @Get('kode/:kode')
  async findByKode(@Param('kode') kode: string) {
    return this.pesananService.findByKode(kode);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles (Role.admin, Role.kasir)
  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: updatePesananDto, 
  ) {
   
    return this.pesananService.update(id, updateDto);
  }
}