FROM node:20-alpine

WORKDIR /app

# ... (bagian atas tetap sama)

COPY . .

# 1. Pastikan Prisma Client ter-generate
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 2. Ganti cara build menggunakan npx (lebih aman)
RUN npx nest build

# 3. KITA DEBUG: Hapus dulu perintah "RUN ls -la dist/", kita ganti pakai ini untuk melihat isi folder saat ini
RUN ls -la

EXPOSE 3000

# Perbaikan format CMD menggunakan format shell biasa
CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && node dist/main.js