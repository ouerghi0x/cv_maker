# Use official Node.js base image
FROM node:20-slim

WORKDIR /app

# Install dependencies and download Tectonic v0.15.0
RUN apt-get update && \
    apt-get install -y curl unzip tar xz-utils && \
    curl -LO https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    tar -xzf tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz && \
    mv tectonic /usr/local/bin/tectonic && \
    chmod +x /usr/local/bin/tectonic && \
    rm tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz

# Install Node.js deps
COPY package*.json ./
RUN npm install
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate
# Copy source files
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
