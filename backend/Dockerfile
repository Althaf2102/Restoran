FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN rm -f tsconfig.build.tsbuildinfo
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN ./node_modules/.bin/nest build

CMD ["sh", "-c", "node dist/main.js || node dist/src/main.js"]