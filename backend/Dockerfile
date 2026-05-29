FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npx tsc -p tsconfig.build.json 2>&1
RUN ls -la dist/

EXPOSE 3000
CMD ["node", "dist/main.js"]