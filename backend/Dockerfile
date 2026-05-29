FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma/
RUN npx nest build --verbose || true
RUN ls -la dist/

EXPOSE 3000
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]