FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --production

COPY . .

RUN npx prisma generate
RUN npm run build

# Run database migrations and seed admin user
RUN npx prisma migrate deploy
RUN node seed-admin.js || true

EXPOSE 4080

ENV PORT=4080
ENV NODE_ENV=production
ENV NEXTAUTH_SECRET=seismicwatch-production-secret-key-change-me
ENV NEXTAUTH_URL=https://seismic.yourdomain.com

CMD ["npm", "start"]
