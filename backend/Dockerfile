FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN ./node_modules/.bin/nest build

# PERINTAH DIAGNOSTIK: Cetak semua isi folder /app dan /app/dist ke logs
CMD echo "=== ISI FOLDER APP ===" && ls -la && echo "=== ISI FOLDER DIST ===" && ls -la dist || echo "Folder dist tidak ada!"