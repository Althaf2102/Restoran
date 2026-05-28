FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npx nest build || true
RUN ls -la && ls -la dist/ || echo "dist folder not found"

EXPOSE 3000
CMD ["node", "dist/main.js"]