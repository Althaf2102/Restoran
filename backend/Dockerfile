FROM node:20-alpine

WORKDIR /app

# 1. Salin file package manager
COPY package*.json ./

# 2. Install dependencies lengkap
RUN npm install --legacy-peer-deps

# 3. Salin seluruh source code project
COPY . .

# 4. Generate Client Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5. Compile NestJS langsung di tempat yang sama
RUN ./node_modules/.bin/nest build

# 6. Jalankan aplikasi secara langsung dari folder output
CMD ["node", "dist/main.js"]