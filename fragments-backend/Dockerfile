# Dockerfile for Fragments microservice
# This file defines how to build a Docker image of our Node.js server

# Use a specific Node.js version
FROM node:22.12.0

# Metadata
LABEL maintainer="Param Katrodia <pkatrodia@myseneca.ca>"
LABEL description="Fragments Node.js microservice container"

# Environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Create and set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd


# Expose port 8080 for documentation
EXPOSE 8080

# Start the service
CMD ["npm", "start"]
