# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Development ----
FROM base AS development
RUN npm ci
COPY . .
RUN npx prisma generate

# ---- Build ----
FROM development AS build
RUN npm run build

# ---- Production ----
FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/apps/api/main"]
