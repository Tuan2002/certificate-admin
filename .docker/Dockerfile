FROM node:20-alpine AS base

FROM base AS deps

# Enable corepack to use yarn
RUN corepack enable
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder

# Enable corepack to use pnpm
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build-time environment variables
ARG NEXT_PUBLIC_IPFS_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_CONTRACT_ADDRESS
# Set the environment variables for the build
ENV NEXT_PUBLIC_IPFS_URL=${NEXT_PUBLIC_IPFS_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_CONTRACT_ADDRESS=${NEXT_PUBLIC_CONTRACT_ADDRESS}

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone output and static files
COPY --from=builder /app/public ./public

RUN mkdir .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]