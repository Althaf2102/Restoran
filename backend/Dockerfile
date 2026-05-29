FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=src/prisma/schema.prisma

# Railway akan mengatur portnya sendiri, baris EXPOSE boleh dilewati

CMD npx prisma migrate deploy --schema=src/prisma/schema.prisma && ./node_modules/.bin/nest build && node dist/main.js