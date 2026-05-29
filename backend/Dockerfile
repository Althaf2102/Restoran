FROM node:20-alpine

WORKDIR /app

# 1. Amankan file konfigurasi dan package manager
COPY package*.json ./

# 2. Install semua dependencies (termasuk Nest CLI untuk nge-build)
RUN npm install --legacy-peer-deps --include=dev

# 3. Salin seluruh source code aplikasi
COPY . .

# 4. Generate Prisma Client agar sinkron dengan database
RUN npx prisma generate --schema=src/prisma/schema.prisma

EXPOSE 3000

# 5. Eksekusi Sakti: Migrasi -> Build NestJS di tempat -> Jalankan aplikasi
CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && ./node_modules/.bin/nest build && node dist/main.js