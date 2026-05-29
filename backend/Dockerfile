FROM node:20-alpine

WORKDIR /app

# 1. Salin package manager files
COPY package*.json ./

# 2. Install SEMUA dependencies (termasuk Nest CLI buat ngebuild)
RUN npm install --legacy-peer-deps

# 3. Salin seluruh kode project tanpa kecuali
COPY . .

# 4. Generate Prisma Client
RUN npx prisma generate --schema=src/prisma/schema.prisma

EXPOSE 3000

# 5. Eksekusi Sakti di Runtime: Migrasi -> Compile NestJS -> Jalankan App
CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && ./node_modules/.bin/nest build && node dist/main.js