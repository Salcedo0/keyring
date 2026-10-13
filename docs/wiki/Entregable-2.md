# Entregable 2 — Full Stack (Vue.js + Nest.js)

Todos los diagramas están hechos en draw.io con la notación de las diapositivas del curso: marcos
Cliente / Servidor, proyectos en azul, paquetes, módulos en gris, clases/archivos en blanco, flechas
naranja de petición/respuesta y flechas negras de comunicación. Las fuentes editables (`.drawio`)
están en el repositorio en `docs/arquitectura/entregable-2/` y en esta wiki en
`images/entregable-2/`.

## 1. Diagrama de clases

![Diagrama de clases](images/entregable-2/diagrama-clases.png)

El dominio tiene **cuatro clases** y **cuatro relaciones**. En la base de datos cada relación es una
llave foránea:

| Relación | Llave foránea | Al eliminar el "uno" |
| --- | --- | --- |
| `Usuario` 1 — 0..* `Propiedad` | `propiedad.usuarioId` | Se eliminan sus propiedades (`ON DELETE CASCADE`) |
| `Propiedad` 1 — 0..* `Contrato` | `contrato.propiedadId` | `ON DELETE CASCADE` |
| `Propiedad` 1 — 0..* `Transaccion` | `transaccion.propiedadId` | `ON DELETE CASCADE` |
| `Contrato` 0..1 — 0..* `Transaccion` | `transaccion.contratoId` (puede ser `null`) | La transacción se conserva, sin contrato (`ON DELETE SET NULL`) |

La API no deja eliminar una propiedad que ya tiene contratos o transacciones (responde `409`), así
que la cascada solo actúa cuando el ADMIN elimina a un usuario.

Notas del modelo:

- **Las categorías no son una clase:** son una lista fija en el back y cada transacción guarda el
  nombre de su categoría. Los **datos del inquilino** son columnas del contrato. Así el modelo
  queda en cuatro clases (decisión D8).
- `Rol`, `TipoPropiedad`, `Modalidad`, `TipoContrato`, `EstadoContrato` y `TipoTransaccion` son
  tipos con valores fijos. La base de datos los revisa con `CHECK`.
- Las fechas se guardan como texto `AAAA-MM-DD` para que la zona horaria nunca cambie el día
  (decisión D5).
- La contraseña nunca se guarda: solo su hash (`contrasenaHash`, bcrypt), que no sale en ninguna
  respuesta de la API.

## 2. Diagramas de arquitectura

### 2.1 Vista general (clientes, SPA y API REST)

![Arquitectura general](images/entregable-2/arquitectura-general.png)

El navegador descarga la SPA (Vue). Desde ella, los servicios de `src/services` llaman a la API REST
(Nest) con axios y envían el token JWT en cada petición. La API revisa el token con un guard global
y lee y escribe en SQLite con TypeORM.

### 2.2 Front-end (SPA)

![Arquitectura del front-end](images/entregable-2/arquitectura-frontend.png)

Capas:

- **`router/`**: las rutas y las guardias de sesión y de rol (`router.beforeEach`).
- **`views/` (VM / V)**: una página por ruta.
- **`components/` (V)**: piezas reutilizables (layout, tabla, gráficos, mapa, formularios).
- **`composables/` (VM)**: la sesión (`useSesion`) y la carga de datos (`useConsulta`). No hay
  store: los datos vienen del back y la sesión se guarda en `localStorage`.
- **`dtos/`, `interfaces/`, `utils/` (M)**: tipos de lo que se envía y se recibe, y funciones
  auxiliares (formato de pesos y fechas, validaciones).
- **`services/` (M)**: `http.ts` (axios con el token y el manejo del 401) y un servicio por
  recurso. Son los únicos que hablan con el back.

### 2.3 Back-end (API REST)

![Arquitectura del back-end](images/entregable-2/arquitectura-backend.png)

Capas:

- **`main.ts` y `app.module.ts`**: arrancan la API, configuran TypeORM, el JWT y el guard global.
- **Un módulo por recurso** (`autenticacion`, `usuarios`, `propiedades`, `contratos`,
  `transacciones`, `tablero`): controller → service → repositorio de TypeORM → entidad. Los DTO
  validan con `class-validator` lo que llega.
- **`comun/`**: el guard de autenticación, los decoradores `@Publica()`, `@SoloAdmin()` y
  `@UsuarioActual()`, y las validaciones de fechas.
- **Base de datos**: SQLite con cuatro tablas (`usuario`, `propiedad`, `contrato`,
  `transaccion`). TypeORM crea las tablas a partir de las entidades.

## 3. Páginas agregadas a la wiki

- [Guía de estilo de programación (Back-end)](Guia-de-estilo-Backend)
- [Reglas de programación (Back-end)](Reglas-de-programacion-Backend)
