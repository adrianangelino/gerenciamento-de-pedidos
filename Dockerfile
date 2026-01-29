# Base image
FROM node:20-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Stage de desenvolvimento
FROM base AS development
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Stage de build
FROM base AS builder
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage de produção
FROM node:20-alpine AS production

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Gerar o Prisma Client
RUN npx prisma generate

# Criar diretório para o banco de dados SQLite
RUN mkdir -p /app/data

# Expor porta
EXPOSE 3000

# Executar migrations e iniciar aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
