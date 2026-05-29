FROM node:20-alpine

WORKDIR /app

# 1. Salin file package manager
COPY package*.json ./

# 2. Install dependencies lengkap
RUN npm install --legacy-peer-deps

# 3. Salin seluruh source code project
COPY . .

# 4. HAPUS paksa cache lokal bawaan laptop agar tidak membingungkan server
RUN rm -f tsconfig.build.tsbuildinfo

# 5. Generate Client Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 6. Jalankan build murni tanpa interupsi cache
RUN ./node_modules/.bin/nest build

# 7. Nyalakan aplikasinya langsung dari main.js!
CMD ["node", "dist/main.js"]