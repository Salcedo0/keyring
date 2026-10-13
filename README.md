# KeyRing · Propiedades en equilibrio

![KeyRing](frontend/src/assets/img/keyring-logo.png)

Dashboard para propietarios de inmuebles en arriendo, de **corta estancia** (tipo Airbnb) y de
**contrato fijo**. Permite registrar propiedades, contratos e ingresos y gastos, y ver el desempeño
del negocio con tablas, filtros y gráficos. Textos en español y valores en pesos colombianos (COP).

Proyecto del curso **Ingeniería de Software para Aplicaciones Web**.

**Toda la documentación está en la [wiki del repositorio](https://github.com/Salcedo0/keyring/wiki)**: diagramas del
Entregable 2, guía de estilo y reglas de programación, contrato de la API, autenticación y decisiones.

## Estado

| Parte | Estado |
| --- | --- |
| `frontend/` | Listo. Todas las pantallas consumen la API; **no tiene datos de ejemplo**. |
| `backend/` | Listo. API en Nest con login (JWT), roles y base de datos SQLite. |

Si el backend no está corriendo, el front abre bien pero cada pantalla muestra el aviso
"No se pudo conectar con el servidor" y sus tablas vacías.

## Estructura

```
keyring/
├── README.md     Este archivo
├── backend/      API REST en Nest.js + TypeORM + SQLite
└── frontend/     SPA en Vue 3 + TypeScript + Vite + Tailwind
```

La arquitectura de cada proyecto está explicada en la wiki: [Entregable 2](https://github.com/Salcedo0/keyring/wiki/Entregable-2).

## Requisitos

- **Node.js 22.18 o superior** (o 24). El backend no arranca con versiones anteriores.
- npm

## Cómo correr el proyecto

### 1. Backend (en una terminal)

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

Cambia los valores del `.env` antes de arrancar. La API queda en `http://localhost:3000/api`. La
primera vez que arranca crea el archivo `database.sqlite` con sus cuatro tablas y el **primer
administrador** con `ADMIN_CORREO` y `ADMIN_CONTRASENA`. No crea datos de ejemplo.

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `JWT_SECRETO` | Sí | Clave para firmar los tokens. Sin ella la API no arranca. Texto largo y aleatorio. |
| `ADMIN_CORREO`, `ADMIN_CONTRASENA` | La primera vez | Datos del primer administrador. |
| `ADMIN_NOMBRE` | No | Nombre del primer administrador. |
| `PORT` | No | Puerto (por defecto `3000`). |
| `CORS_ORIGIN` | No | Direcciones del front que pueden llamar a la API, separadas por coma. |
| `SQLITE_PATH` | No | Dónde guardar la base de datos (en Docker, en un volumen). |

### 2. Frontend (en otra terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`. La ruta principal es `/` (página pública de inicio).
Para entrar: usa el administrador del `.env` del backend, o crea una cuenta en "Crear cuenta".

| Variable | Para qué | Ejemplo |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Dirección del backend, sin `/api` al final | `http://localhost:3000` |

### Comandos

| Comando | Backend | Frontend |
| --- | --- | --- |
| `npm run start:dev` / `npm run dev` | Arranca y se reinicia al guardar | Servidor de desarrollo |
| `npm run build` | Compila a `dist/` | Revisa los tipos y genera `dist/` |
| `npm run format` | Formatea con Prettier | Formatea con Prettier |
| `npm run type-check` | | Revisa los tipos de TypeScript |
| `npm run preview` | | Sirve el `dist/` generado |

## Páginas

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` | Inicio | Pública |
| `/ingresar` | Login | Pública |
| `/registrarse` | Crear cuenta de propietario | Pública |
| `/dashboard` | Indicadores, gráficos y últimas transacciones | Con sesión |
| `/propiedades` | Lista y mapa de propiedades | Con sesión |
| `/propiedades/nueva`, `/propiedades/:id/editar` | Formulario de propiedad | Con sesión |
| `/contratos` | Lista de contratos con filtros | Con sesión |
| `/contratos/nuevo`, `/contratos/:id/editar` | Formulario de contrato | Con sesión |
| `/transacciones` | Lista, filtros y gráfico por categoría | Con sesión |
| `/transacciones/nueva`, `/transacciones/:id/editar` | Formulario de transacción | Con sesión |
| `/admin/usuarios` | Usuarios por rol | Solo `ADMIN` |

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
| `LogoKeyRing` | `base/` | Logo completo o solo ícono, en versión normal o clara (fondos oscuros) |
| `InsigniaEstado`, `AvisoError`, `EstadoVacio` | `base/` | Insignias de color, avisos de error, "No hay datos todavía" |
| `PlantillaInterna`, `MenuLateral`, `BarraSuperior` | `layout/` | Estructura de las páginas internas, menú colapsable |

## Pendientes

- Despliegue en GCP con Docker, como en el tutorial 08 del curso.
