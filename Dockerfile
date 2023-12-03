# Ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:20 AS base

# ----- DEPS -----

FROM base AS deps

WORKDIR /app

COPY . .

# use node.js corepack to install pnpm (based on packageVersion in package.json)
RUN corepack enable && corepack prepare --activate
RUN pnpm install --frozen-lockfile

# ----- BUILDER -----

FROM deps AS builder

WORKDIR /app

RUN pnpm build.frontend
RUN pnpm build.backend

# ----- PROD DEPS -----

FROM base as proddeps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare --activate
# only install production dependencies
RUN pnpm install --frozen-lockfile --prod

# ----- RUNNER -----

FROM base AS runner

WORKDIR /app

# environment variables (could be passed in as well if needed)
ENV NODE_ENV production
ENV PORT 8080

# permissions
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 runner
USER runner

COPY --from=builder --chown=runner:nodejs /app/dist .
COPY --from=proddeps /app/node_modules ./node_modules

EXPOSE $PORT

CMD ["node", "backend/main.js"]