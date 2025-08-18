FROM node:latest AS builder

WORKDIR /app

COPY package*.json .
  
RUN npm ci --omit-dev && npm cache clean --force

COPY . .

# Build TypeScript to JavaScript
RUN npm run build

FROM node:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit-dev && npm cache clean --force

EXPOSE 7001

CMD [ "node", "dist/index.js" ]