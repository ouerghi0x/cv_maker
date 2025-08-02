# --------- Stage 1: Build ---------
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL, Tectonic, and required build tools
RUN apt-get update && \
    apt-get install -y openssl curl unzip tar xz-utils && \
    curl -LO https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    tar -xzf tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    mv tectonic /usr/local/bin/tectonic && \
    chmod +x /usr/local/bin/tectonic && \
    rm tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz

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

# Install OpenSSL (needed at runtime for Prisma client to work)
RUN apt-get update && apt-get install -y openssl

# Copy Tectonic binary
COPY --from=builder /usr/local/bin/tectonic /usr/local/bin/tectonic

# Copy necessary app files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Optional: copy env if required in container

EXPOSE 3000

CMD ["npm", "start"]
