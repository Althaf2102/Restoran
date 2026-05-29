FROM node:20-alpine

WORKDIR /app

# 1. Salin manifes dependensi
COPY package*.json ./

# 2. Install dependensi lengkap (termasuk Nest CLI internal)
RUN npm install --legacy-peer-deps

# 3. Salin sisa kode proyek
COPY . .

# 4. Generate Prisma Client
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Build menggunakan script bawaan package.json
RUN npm run build

# 6. Perintah jalankan: Cari di dist luar, jika terbungkus, cari di dist/src
CMD ["sh", "-c", "node dist/main.js || node dist/src/main.js"]