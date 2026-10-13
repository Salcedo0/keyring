# Etapa 1: instala todo, compila y deja solo las dependencias de producción.
# better-sqlite3 es un módulo nativo: se instala una sola vez aquí y se copia, en vez de
# reinstalarlo en la etapa final (Presentación 12, diapositiva 18).
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# Etapa 2: imagen final con lo mínimo para correr. Los secretos llegan por variables de entorno.
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
