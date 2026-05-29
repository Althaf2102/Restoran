FROM node:20-alpine

WORKDIR /app

# 1. Salin package manager files
COPY package*.json ./

# 2. Install SEMUA dependencies (termasuk Nest CLI buat kompilasi)
RUN npm install --legacy-peer-deps

# 3. Salin seluruh kode project tanpa kecuali
COPY . .

# 4. Generate Prisma Client (Hanya generate client, tidak melakukan migrasi!)
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Eksekusi Sakti: Compile NestJS secara live lalu langsung hidupkan aplikasinya!
CMD ./node_modules/.bin/nest build && node dist/main.js