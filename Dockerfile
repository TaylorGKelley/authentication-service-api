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

COPY src/ ./src
COPY drizzle.config.ts ./
COPY tsconfig.json ./
CMD ["npm", "run", "db:setup"]

FROM node:24-alpine AS base
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# Set Production Environment variables
ENV NODE_ENV='production'
ENV SHOW_ERROR_STACK=false
ENV CLIENT_ID='8d46d402-37e4-4b9c-82ef-ccf44acbb43f'
ENV DATABASE_URL='postgres://postgres:PASSWORD@localhost:5432/authentication_service'
ENV REDIS_HOST=redist-token-store
ENV REDIS_PORT=6379

FROM base AS production
RUN npm ci --omit=dev && npm cache clean --force
# Security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 7001
CMD [ "node", "dist/index.js" ]