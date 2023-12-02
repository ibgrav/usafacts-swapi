# Ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:20 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY . .
# use node.js corepack to install pnpm (based on packageVersion in package.json)
RUN corepack enable && corepack prepare --activate
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# TODO: figure out how to not repeate this
RUN corepack enable && corepack prepare --activate
RUN pnpm -F frontend build
RUN pnpm -F backend build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 runner
# TODO: prune dev dependencies to reduce image size
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=runner:nodejs /app/dist .
USER runner
EXPOSE $PORT
CMD ["node", "main.js"]