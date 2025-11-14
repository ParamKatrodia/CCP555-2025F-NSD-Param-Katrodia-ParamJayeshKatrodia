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

# Copy only what backend needs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/tests ./tests  
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/tests/.htpasswd ./tests/.htpasswd

ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]
