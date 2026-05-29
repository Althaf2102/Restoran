FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --include=dev

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN cat tsconfig.build.json
RUN npx tsc --version
RUN npx tsc -p tsconfig.build.json --listFiles 2>&1 | head -50
RUN ls -la /app/
RUN ls -la /app/src/ || echo "src not found in /app"

EXPOSE 3000
CMD ["node", "dist/main.js"]