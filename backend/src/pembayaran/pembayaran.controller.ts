// src/pembayaran/pembayaran.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards
} from '@nestjs/common';
import { PembayaranService } from './pembayaran.service';
import { CreatePembayaranDto } from './DTO/create-pembayaran.dto';
import { UpdatePembayaranDto } from './DTO/update-pembayaran.dto';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('pembayaran')
@ApiBearerAuth()
@Controller('pembayaran')
export class PembayaranController {
  constructor(private readonly pembayaranService: PembayaranService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.pelanggan, Role.kasir)
  @Post()
  async create(@Body() createPembayaranDto: CreatePembayaranDto) {
    return this.pembayaranService.create(createPembayaranDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.kasir)
  @Get()
  async findAll() {
    return this.pembayaranService.findAll();
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.kasir)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pembayaranService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.kasir,Role.pelanggan)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePembayaranDto: UpdatePembayaranDto
  ) {
    return this.pembayaranService.update(id, updatePembayaranDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.kasir)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.pembayaranService.remove(id);
  }
}