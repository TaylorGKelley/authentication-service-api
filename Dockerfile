FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json .
  
# Install dependencies, including dev so that tsc command is accesible
RUN npm ci && npm cache clean --force

COPY . .

# Build TypeScript to JavaScript
RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

ENV NODE_ENV='production'
ENV PORT=7001
ENV SHOW_ERROR_STACK=false

# Security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 7001

CMD [ "node", "dist/index.js" ]