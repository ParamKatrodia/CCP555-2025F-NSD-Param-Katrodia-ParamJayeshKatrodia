##############################
# Stage 1 — Builder
##############################
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Create dist folder with UI files
RUN mkdir -p dist \
  && cp index.html dist/index.html \
  && cp -R src dist/src

##############################
# Stage 2 — Nginx
##############################
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
