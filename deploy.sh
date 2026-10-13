#!/usr/bin/env bash
# Construye y levanta KeyRing en la VM. Los valores (IP, secretos, administrador) se leen del
# archivo .env de esta carpeta, que NO se sube al repositorio: se copia de .env.example y se llena
# en la VM.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Falta el archivo .env. Cópialo de .env.example y llena los valores." >&2
  exit 1
fi

docker compose up -d --build
docker compose ps
