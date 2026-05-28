import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { PesananModule } from './pesanan/pesanan.module';
import { AuthModule } from './auth/auth.module';
import { PembayaranModule } from './pembayaran/pembayaran.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← tambah ini paling atas
    PrismaModule,
    MenuModule,
    PesananModule,
    AuthModule,
    PembayaranModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}