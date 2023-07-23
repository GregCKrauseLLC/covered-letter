FROM node:18-alpine AS base

FROM base AS deps
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build step for the static-rendering tab requires a locally-running instance of the API
ENV API_URL http://host.docker.internal:3000
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENTRYPOINT ["/app/entrypoint.sh"]
