# syntax=docker/dockerfile:1.7

FROM node:22.22-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
ARG PNPM_VERSION=10.34.5

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN CI=true pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ENV NEXT_OUTPUT_STANDALONE=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=build_database,required=true \
    node -e "const fs = require('node:fs'); const zlib = require('node:zlib'); fs.writeFileSync('/tmp/underwood-build.db', zlib.gunzipSync(fs.readFileSync('/run/secrets/build_database')))" \
    && DATABASE_URL=file:/tmp/underwood-build.db \
       PAYLOAD_SECRET=build-only-payload-secret-not-used-at-runtime \
       PAYLOAD_PUBLIC_SERVER_URL=https://underwood.by \
       pnpm build \
    && rm -f /tmp/underwood-build.db /tmp/underwood-build.db-shm /tmp/underwood-build.db-wal
RUN mkdir -p /app/.sharp-libvips && cp -a /app/node_modules/.pnpm/@img+sharp-libvips-* /app/.sharp-libvips/

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005
ENV HOSTNAME=0.0.0.0

RUN mkdir -p /app/.next /app/media /app/data && chown -R node:node /app

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.sharp-libvips/ ./node_modules/.pnpm/
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3005

CMD ["node", "server.js"]
