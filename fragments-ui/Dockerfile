############################
# Stage 1 — Builder
############################
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

############################
# Stage 2 — Production Image
############################
FROM node:18-alpine AS production

WORKDIR /app

# Copy only what’s needed for production
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/auth ./auth
COPY --from=builder /app/model ./model
COPY --from=builder /app/lib ./lib

EXPOSE 8080

CMD ["node", "src/index.js"]
