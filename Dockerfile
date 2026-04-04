FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4080

ENV PORT=4080
ENV NODE_ENV=production

CMD ["npm", "start"]
