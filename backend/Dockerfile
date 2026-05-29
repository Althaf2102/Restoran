FROM node:20-alpine

WORKDIR /app

# 1. Salin file package manager
COPY package*.json ./

# 2. Install dependencies lengkap
RUN npm install --legacy-peer-deps

# 3. Salin seluruh source code project
COPY . .

# 4. Hapus paksa cache lokal bawaan laptop
RUN rm -f tsconfig.build.tsbuildinfo

# 5. Generate Client Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 6. Pindahkan build ke runtime agar error-nya tidak disembunyikan Railway
CMD ./node_modules/.bin/nest build && node dist/main.js