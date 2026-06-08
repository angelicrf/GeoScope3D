# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for build cache efficiency
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build the app
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
