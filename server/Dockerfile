FROM node:22-alpine AS base

WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and Prisma schema
COPY tsconfig.json ./tsconfig.json
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client (needed both at build and runtime)
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built app and runtime deps
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY package.json ./package.json

EXPOSE 3001

# Directly run the compiled server entry (avoids any script mismatch)
CMD ["node", "dist/src/server.js"]

