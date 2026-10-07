# Backend de KeyRing

> **Pendiente.** Esta carpeta queda lista para la API, siguiendo la estructura del curso.

## Qué va aquí

La API REST que consume el frontend, con el stack del curso:

- **Nest.js** + **TypeORM** + **SQLite** (`better-sqlite3`)
- Prefijo global `/api` (`app.setGlobalPrefix('api')`)
- CORS leído de la variable `CORS_ORIGIN`
- Puerto leído de `PORT` (por defecto `3000`)

## Qué debe responder

Todo está escrito en [`../docs/CONTRATO-API.md`](../docs/CONTRATO-API.md): rutas, filtros, cuerpos,
respuestas y errores. El frontend **ya consume exactamente ese contrato**, así que el back solo
tiene que cumplirlo para que todo funcione.

Módulos sugeridos, uno por recurso del contrato:

| Módulo | Rutas |
| --- | --- |
| `auth` | `POST /auth/ingresar` |
| `tablero` | `GET /tablero` |
| `propiedades` | CRUD `/propiedades` |
| `contratos` | CRUD `/contratos` |
| `transacciones` | CRUD `/transacciones` y `GET /transacciones/resumen-por-categoria` |
| `categorias` | CRUD `/categorias` (escritura solo `ADMIN`) |
| `usuarios` | `GET`, `DELETE /usuarios` y `GET /usuarios/resumen-por-rol` (solo `ADMIN`) |

## Reglas

Las mismas de [`../GUIA-DE-CODIGO.md`](../GUIA-DE-CODIGO.md): todo en español, funciones cortas,
mensajes de error en español (el front los muestra tal cual) y documentación al terminar cada
cambio.
