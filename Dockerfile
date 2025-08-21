FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json .
# Install dependencies, including dev so that tsc command is accesible
RUN npm ci && npm cache clean --force
COPY . .
# Build TypeScript to JavaScript
RUN npm run build

FROM node:24-alpine AS migrations
WORKDIR /app/migrations
COPY package*.json ./
RUN npm ci --include=dev && npm cache clean --force

COPY src/infrastructure/database ./src/infrastructure/database
COPY drizzle.config.ts ./
CMD ["npm", "run", "db:setup"]

FROM node:24-alpine AS base
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
ENV NODE_ENV='production'
ENV SHOW_ERROR_STACK=false

FROM base AS production
RUN npm ci --omit=dev && npm cache clean --force
# Security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 7001
CMD [ "node", "dist/index.js" ]