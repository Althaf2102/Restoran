FROM node:20-alpine

WORKDIR /app

# 1. Salin package manager files
COPY package*.json ./

# 2. Install SEMUA dependencies
RUN npm install --legacy-peer-deps

# 3. Salin seluruh kode project
COPY . .

# 4. Generate Prisma Client
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Eksekusi Build & Coba jalankan lewat sub-folder src
CMD ./node_modules/.bin/nest build && (node dist/main.js || node dist/src/main.js)