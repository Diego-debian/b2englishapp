FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json ./
# Si tienes package-lock.json, descomenta para builds reproducibles:
# COPY package-lock.json ./
RUN npm install --legacy-peer-deps


FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

# ✅ Build-time env for Next (NEXT_PUBLIC_* se usa en build)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# ✅ Runtime env (por si tu código también lo lee en server)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Next standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
