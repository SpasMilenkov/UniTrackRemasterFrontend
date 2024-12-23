# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm install
# Copy source files
COPY . .
# Build the Nuxt app
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine
WORKDIR /app
# Copy built files from the previous stage
COPY --from=builder /app/.output ./
# Expose the port used by Nuxt
EXPOSE 3000
# Run the Nuxt app
CMD ["node", "server/index.mjs"]