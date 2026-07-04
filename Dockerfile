FROM node:22.22-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
ARG PNPM_VERSION=10.18.3

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG CMS_SEED_ADMIN_EMAIL
ARG CMS_SEED_ADMIN_PASSWORD

ENV DATABASE_URL=${DATABASE_URL}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV CMS_SEED_ADMIN_EMAIL=${CMS_SEED_ADMIN_EMAIL}
ENV CMS_SEED_ADMIN_PASSWORD=${CMS_SEED_ADMIN_PASSWORD}
ENV NEXT_OUTPUT_STANDALONE=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build
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
