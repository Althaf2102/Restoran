# === STAGE 1: Build Application ===
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package manager files
COPY package*.json ./

# Install SEMUA dependencies (termasuk Nest CLI)
RUN npm install --legacy-peer-deps

# Salin seluruh kode project ke dalam container
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Compile project NestJS (Menghasilkan folder dist)
RUN ./node_modules/.bin/nest build

# === STAGE 2: Run Application ===
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Hanya install production dependencies (Biar container ringan)
RUN npm install --legacy-peer-deps --only=production

# Ambil hasil dari STAGE 1 (Prisma & Folder dist dijamin ikut keangkut)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/prisma ./src/prisma

EXPOSE 3000

# Jalankan migrasi lalu hidupkan server
CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && node dist/main.js