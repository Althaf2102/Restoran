FROM node:20-alpine

WORKDIR /app

# 1. Salin file package manager
COPY package*.json ./

# 2. Install dependensi lengkap
RUN npm install --legacy-peer-deps

# 3. Salin seluruh source code project dari laptop ke Docker
COPY . .

# 4. Generate Client Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Compile TypeScript (NestJS) menjadi JavaScript biasa
RUN ./node_modules/.bin/nest build

# 6. PERINTAH SAKTI (DIAGNOSTIK): 
#    Jangan nyalakan aplikasi dulu. Cetak dulu semua isi folder untuk kita intip bareng-bareng!
CMD echo "=== ISI FOLDER UTAMA APP ===" && ls -la && echo "=== ISI FOLDER HASIL BUILD DIST ===" && ls -la dist || echo "Folder dist tidak ada!"