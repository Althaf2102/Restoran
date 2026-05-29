FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN ./node_modules/.bin/nest build
RUN ls -la dist/

EXPOSE 3000
CMD ["npx", "prisma", "migrate", "deploy", "--schema=src/prisma/schema.prisma", "&&", "node", "dist/main.js"]