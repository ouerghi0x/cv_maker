# --------- Stage 1: Build ---------
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL, Tectonic, and required build tools
# Explicitly install ca-certificates and fontconfig for better reliability
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    curl \
    unzip \
    tar \
    xz-utils \
    ca-certificates \
    fontconfig \
    && \
    # Update CA certificates to ensure they are current and trusted
    update-ca-certificates && \
    # Download and install Tectonic
    curl -LO https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    tar -xzf tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    mv tectonic /usr/local/bin/tectonic && \
    chmod +x /usr/local/bin/tectonic && \
    rm tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    # Clean up apt cache to reduce image size
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the full app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# --------- Stage 2: Runtime ---------
FROM node:20-slim AS runner

WORKDIR /app

# Install OpenSSL, ca-certificates, and fontconfig (needed at runtime)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    fontconfig \
    && \
    # Update CA certificates at runtime too
    update-ca-certificates && \
    # Clean up apt cache
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy Tectonic binary
COPY --from=builder /usr/local/bin/tectonic /usr/local/bin/tectonic

# Copy necessary app files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Optional: copy env if required in container
# COPY .env.production ./.env.production

EXPOSE 3000

CMD ["npm", "start"]