# ==========================================
# 1. Base Node.js
# ==========================================
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable


# ==========================================
# 2. Installation des dépendances
# ==========================================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

# Prisma 7 : fichiers nécessaires à la génération
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN pnpm install --frozen-lockfile


# ==========================================
# 3. Construction de Next.js
# ==========================================
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# URL temporaire utilisée uniquement pendant le build
ENV DATABASE_URL="mysql://build:build@127.0.0.1:3306/berem"

RUN pnpm build


# ==========================================
# 4. Image finale optimisée
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/public ./public

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]