# ============================================================================
# Build stage: compile TypeScript and install all dependencies
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ============================================================================
# Runtime stage: minimal image with prod deps only
# ============================================================================
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

USER nodejs

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/server.js"]
