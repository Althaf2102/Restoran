FROM node:20-alpine

WORKDIR /app

# 1. Salin manifes dependencies
COPY package*.json ./

# 2. Hanya install modul produksi biar proses deploy kilat
RUN npm install --production --legacy-peer-deps

# 3. Salin folder hasil build lokal (dist) dan folder prisma
COPY dist ./dist
COPY src/prisma ./src/prisma

# 4. Generate Client Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Langsung gass jalankan aplikasi!
CMD ["node", "dist/main.js"]