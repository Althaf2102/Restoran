FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN ./node_modules/.bin/nest build || echo "nest build failed"
RUN ls -la || true
RUN ls -la dist/ || echo "dist not found"

EXPOSE 3000
CMD ["node", "dist/main.js"]