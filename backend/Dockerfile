FROM node:20-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

# 2. Copy semua file project
COPY . .

# 3. Generate prisma client
RUN npx prisma generate --schema=src/prisma/schema.prisma

EXPOSE 3000

# 4. Trik Sakti: Jalankan build dan jalankan app SEKALIGUS di runtime
CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && ./node_modules/.bin/nest build && node dist/main.js