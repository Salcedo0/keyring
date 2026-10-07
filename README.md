# KeyRing

Dashboard para propietarios de inmuebles en arriendo, de **corta estancia** (tipo Airbnb) y de
**contrato fijo**. Permite registrar propiedades, contratos e ingresos y gastos, y ver el desempeño
del negocio con tablas, filtros y gráficos. Textos en español y valores en pesos colombianos (COP).

Proyecto del curso **Ingeniería de Desarrollo Web**.

## Estado

| Parte | Estado |
| --- | --- |
| `frontend/` | Listo. Todas las pantallas consumen la API; **no tiene datos de ejemplo**. |
| `backend/` | Pendiente. Ver [`backend/README.md`](backend/README.md). |
| Contrato de la API | Listo en [`docs/CONTRATO-API.md`](docs/CONTRATO-API.md). |

Mientras el backend no exista, el front abre bien pero cada pantalla muestra el aviso
"No se pudo conectar con el servidor" y sus tablas vacías. Es el comportamiento esperado.

## Estructura

```
keyring/
├── GUIA-DE-CODIGO.md     Reglas para escribir el código (leer antes de programar)
├── README.md             Este archivo
├── docs/
│   └── CONTRATO-API.md   Lo que el back debe responder
├── backend/              API en Nest (pendiente)
└── frontend/             App en Vue 3 + TypeScript + Vite + Tailwind
```

El detalle de cada carpeta de `frontend/src/` está en la sección 3 de
[`GUIA-DE-CODIGO.md`](GUIA-DE-CODIGO.md).

## Requisitos

- Node.js 20.19 o superior (o 22.12 o superior)
- npm

## Cómo correr el frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`. La ruta principal es `/` (página pública de inicio).

### Variables de entorno

| Variable | Para qué | Ejemplo |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Dirección del backend, sin `/api` al final | `http://localhost:3000` |

### Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run type-check` | Revisa los tipos de TypeScript |
| `npm run build` | Revisa los tipos y genera `dist/` para producción |
| `npm run preview` | Sirve el `dist/` generado |
| `npm run format` | Formatea el código con Prettier |

## Páginas

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` | Inicio | Pública |
| `/ingresar` | Login | Pública |
| `/dashboard` | Indicadores, gráficos y últimas transacciones | Con sesión |
| `/propiedades` | Lista y mapa de propiedades | Con sesión |
| `/propiedades/nueva`, `/propiedades/:id/editar` | Formulario de propiedad | Con sesión |
| `/contratos` | Lista de contratos con filtros | Con sesión |
| `/contratos/nuevo`, `/contratos/:id/editar` | Formulario de contrato | Con sesión |
| `/transacciones` | Lista, filtros y gráfico por categoría | Con sesión |
| `/transacciones/nueva`, `/transacciones/:id/editar` | Formulario de transacción | Con sesión |
| `/admin/usuarios` | Usuarios por rol | Solo `ADMIN` |
| `/admin/categorias` | Categorías de transacción | Solo `ADMIN` |

Sin sesión, cualquier página interna redirige al login. Un usuario sin rol `ADMIN` no ve las
opciones de administración en el menú y, si escribe la dirección a mano, vuelve al dashboard.

## Componentes reutilizables

| Componente | Carpeta | Para qué |
| --- | --- | --- |
| `TablaDatos` | `tabla/` | Tabla con columnas, acciones editar/eliminar, carga y estado vacío |
| `FiltroSelector` | `formulario/` | Selector compacto con etiqueta para las barras de filtros |
| `CampoTexto`, `CampoSelector`, `GrupoOpciones` | `formulario/` | Campos de formulario con error de validación |
| `TarjetaKpi` | `base/` | Número grande con etiqueta |
| `TarjetaGrafico` | `base/` | Título + gráfico, con estado vacío si no hay datos |
| `GraficoLineas`, `GraficoBarras`, `GraficoDona` | `graficos/` | Gráficos con Chart.js |
| `MapaPropiedades`, `SelectorUbicacion` | `mapa/` | Mapas con Leaflet y OpenStreetMap |
| `InsigniaEstado`, `AvisoError`, `EstadoVacio` | `base/` | Insignias de color, avisos de error, "No hay datos todavía" |
| `PlantillaInterna`, `MenuLateral`, `BarraSuperior` | `layout/` | Estructura de las páginas internas, menú colapsable |

## Pendientes

- Construir el backend en `backend/` siguiendo `docs/CONTRATO-API.md`.
- Conectar el despliegue (Docker y GCP), como en el tutorial 08 del curso.

## Documentación

| Documento | Contenido |
| --- | --- |
| [`GUIA-DE-CODIGO.md`](GUIA-DE-CODIGO.md) | Reglas de código: idioma, nombres, estructura, KISS, comentarios, git |
| [`docs/CONTRATO-API.md`](docs/CONTRATO-API.md) | Endpoints, filtros, cuerpos, respuestas y errores de la API |
| [`backend/README.md`](backend/README.md) | Qué falta en el back y cómo se organiza |

Cada cambio se documenta al terminarlo (ver la sección 13 de la guía).
