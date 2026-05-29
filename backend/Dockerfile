FROM node:20-alpine

WORKDIR /app

# 1. Salin manifes package manager
COPY package*.json ./

# 2. Install semua dependensi (termasuk development dependencies untuk compiler)
RUN npm install --legacy-peer-deps

# 3. Salin sisa source code proyek
COPY . .

# 4. Hapus paksa sisa cache build lokal dari laptop jika ada
RUN rm -f tsconfig.build.tsbuildinfo

# 5. Generate Client Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 6. Kompilasi NestJS langsung menggunakan nest CLI internal
RUN npx @nestjs/cli build

# 7. Nyalakan aplikasinya menggunakan node biasa
CMD ["node", "dist/main.js"]