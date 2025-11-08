# Stage 1: Build the application
FROM oven/bun:1.0-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code and build the application
COPY . .
RUN bun run build

# Stage 2: Serve the application with a lean and secure Nginx setup
FROM nginx:1.25-alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration
# This will replace the default server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Traefik to connect to
EXPOSE 80

# Health check to ensure Nginx is running and serving content
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]