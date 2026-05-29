FROM node:20-alpine

WORKDIR /app

# 1. Salin package manager files
COPY package*.json ./

# 2. Install SEMUA dependencies
RUN npm install --legacy-peer-deps

# 3. Salin seluruh kode project tanpa kecuali
COPY . .

# 4. Generate Prisma Client secara bersih
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Eksekusi Sakti Runtime: Jalankan build secara live di server, 
#    lalu cari file main.js di root dist maupun di dalam subfolder src.
CMD ./node_modules/.bin/nest build && (node dist/main.js || node dist/src/main.js)