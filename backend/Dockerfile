FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

COPY . .

RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN ./node_modules/.bin/nest build

EXPOSE 3000

CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && ls -la dist && node dist/main.js
