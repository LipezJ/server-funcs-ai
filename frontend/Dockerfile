# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json frontend/
RUN npm ci --workspace frontend --include-workspace-root=false

COPY frontend ./frontend

RUN npm run build --workspace frontend

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY package*.json ./
COPY frontend/package*.json frontend/
RUN npm ci --omit=dev --workspace frontend --include-workspace-root=false

COPY --from=builder /app/frontend/dist ./frontend/dist

WORKDIR /app/frontend
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
