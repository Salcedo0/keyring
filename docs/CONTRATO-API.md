# Contrato de la API de KeyRing

Este documento es **la fuente de verdad** entre el front y el back. El front ya está escrito para
consumir exactamente estas rutas y formas; el back debe responderlas igual.

Si algo cambia, se cambia **primero aquí** y luego en el código de los dos lados.

---

## Reglas generales

- **URL base:** `${VITE_API_BASE_URL}/api` (por defecto `http://localhost:3000/api`).
- **Formato:** JSON. Los nombres de los campos van en camelCase y en español, como en este
  documento.
- **Autenticación:** todas las rutas, excepto `POST /auth/ingresar` y `POST /auth/registrarse`,
  requieren el encabezado `Authorization: Bearer <token>`. El token dura 8 horas.
- **Fechas:** texto `AAAA-MM-DD` (ej. `2026-09-30`), sin hora. **Meses:** `AAAA-MM`.
- **Dinero:** número entero en pesos colombianos (COP), sin decimales. Ej. `1840000`.
- **Ids:** números enteros.
- **Filtros:** van como parámetros de la URL (`?propiedadId=3&estado=ACTIVO`). Un filtro que no se
  envía significa "todos".
- **Alcance de los datos:** un `PROPIETARIO` solo ve sus propias propiedades, contratos y
  transacciones. Un `ADMIN` además administra usuarios y categorías.

### Errores

| Código | Cuándo | Qué hace el front |
| --- | --- | --- |
| `400` | Datos inválidos | Muestra el `message` |
| `401` | Sin token, token vencido o credenciales incorrectas | Cierra la sesión y lleva al login |
| `403` | Un `PROPIETARIO` intenta una ruta de `ADMIN` | Muestra el `message` |
| `404` | No existe el recurso | Muestra el `message` |
| `409` | Conflicto (ej. categoría con nombre repetido) | Muestra el `message` |

Cuerpo de error (el formato por defecto de Nest):

```json
{ "statusCode": 400, "message": "La fecha de fin debe ser posterior a la de inicio", "error": "Bad Request" }
```

`message` puede ser un texto o una lista de textos. Deben estar **en español**, porque el front
los muestra tal cual.

---

## Tipos

```ts
type Rol = 'ADMIN' | 'PROPIETARIO'
type TipoPropiedad = 'APARTAMENTO' | 'CASA' | 'LOFT' | 'ESTUDIO' | 'LOCAL'
type Modalidad = 'CORTA' | 'FIJA' | 'AMBAS'          // corta estancia, contrato fijo o ambas
type TipoContrato = 'CORTA' | 'FIJA'
type EstadoContrato = 'ACTIVO' | 'PENDIENTE' | 'FINALIZADO' | 'CANCELADO'
type TipoTransaccion = 'INGRESO' | 'GASTO'

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: Rol
}

interface Propiedad {
  id: number
  nombre: string          // "Apto Poblado 1203"
  direccion: string
  ciudad: string
  tipo: TipoPropiedad
  modalidad: Modalidad
  latitud: number | null
  longitud: number | null
}

interface Inquilino {
  nombre: string
  documento: string
  correo: string
  telefono: string        // puede venir vacío
}

interface Contrato {
  id: number
  propiedadId: number
  propiedadNombre: string // lo arma el back para no pedir la propiedad aparte
  inquilino: Inquilino
  tipo: TipoContrato
  fechaInicio: string     // AAAA-MM-DD
  fechaFin: string        // AAAA-MM-DD, posterior a fechaInicio
  valor: number           // total de la estadía, o canon mensual si es FIJA
  estado: EstadoContrato
}

interface Categoria {
  id: number
  nombre: string
  tipo: TipoTransaccion
}

interface Transaccion {
  id: number
  propiedadId: number
  propiedadNombre: string
  contratoId: number | null
  tipo: TipoTransaccion
  categoriaId: number
  categoriaNombre: string
  monto: number           // siempre positivo; el tipo dice si suma o resta
  fecha: string           // AAAA-MM-DD
  descripcion: string
}
```

---

## Autenticación

### `POST /auth/ingresar`

Cuerpo:

```json
{ "correo": "daniel.mejia@correo.co", "contrasena": "********" }
```

Respuesta `200`:

```json
{
  "token": "eyJhbGciOi...",
  "usuario": { "id": 2, "nombre": "Daniel Mejía", "correo": "daniel.mejia@correo.co", "rol": "PROPIETARIO" }
}
```

Credenciales incorrectas: `401` con `message: "Correo o contraseña incorrectos"`.

### `POST /auth/registrarse`

Crea una cuenta de `PROPIETARIO` y deja la sesión iniciada. Es pública, como el login (ver la
decisión D1 en [`DECISIONES.md`](DECISIONES.md)).

Cuerpo:

```json
{ "nombre": "Daniel Mejía", "correo": "daniel.mejia@correo.co", "contrasena": "mínimo 8 caracteres" }
```

Respuesta `201`: igual a la del login (`token` y `usuario`).

Correo ya registrado: `409` con `message: "Ya existe una cuenta con ese correo"`.

---

## Tablero (Dashboard)

### `GET /tablero`

Filtros: `propiedadId`, `desde` (AAAA-MM-DD), `hasta` (AAAA-MM-DD).

Respuesta `200`:

```json
{
  "indicadores": {
    "ingresos": 86420000,
    "gastos": 31785000,
    "utilidadNeta": 54635000,
    "contratosActivos": 9
  },
  "porMes": [
    { "mes": "2026-04", "ingresos": 12800000, "gastos": 5100000 }
  ],
  "gastosPorCategoria": [
    { "categoria": "Administración", "total": 9600000 }
  ],
  "ultimasTransacciones": [ /* Transaccion[], las 6 más recientes del rango */ ]
}
```

- `porMes` incluye **todos** los meses del rango, también los que no tienen movimientos (en 0).
- `contratosActivos` cuenta los contratos con estado `ACTIVO`, sin importar el rango de fechas.

---

## Propiedades

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/propiedades` | | `Propiedad[]` |
| `GET` | `/propiedades/:id` | | `Propiedad` |
| `POST` | `/propiedades` | `GuardarPropiedad` | `201` `Propiedad` |
| `PUT` | `/propiedades/:id` | `GuardarPropiedad` | `Propiedad` |
| `DELETE` | `/propiedades/:id` | | `204` |

`GuardarPropiedad` es `Propiedad` sin `id`. Todos los campos son obligatorios, incluida la
ubicación (`latitud` y `longitud`).

Una propiedad con contratos o transacciones no se puede eliminar: `409` con un `message` que lo
explique.

---

## Contratos

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/contratos` | | `Contrato[]` |
| `GET` | `/contratos/:id` | | `Contrato` |
| `POST` | `/contratos` | `GuardarContrato` | `201` `Contrato` |
| `PUT` | `/contratos/:id` | `GuardarContrato` | `Contrato` |
| `DELETE` | `/contratos/:id` | | `204` |

Filtros de `GET /contratos`: `propiedadId`, `estado`.

`GuardarContrato` es `Contrato` sin `id` ni `propiedadNombre`. Validaciones: inquilino con nombre,
documento y correo válido; `fechaFin` posterior a `fechaInicio`; `valor` mayor que 0.

---

## Transacciones

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/transacciones` | | `Transaccion[]` |
| `GET` | `/transacciones/:id` | | `Transaccion` |
| `POST` | `/transacciones` | `GuardarTransaccion` | `201` `Transaccion` |
| `PUT` | `/transacciones/:id` | `GuardarTransaccion` | `Transaccion` |
| `DELETE` | `/transacciones/:id` | | `204` |
| `GET` | `/transacciones/resumen-por-categoria` | | `ResumenCategoria[]` |

Filtros de `GET /transacciones` y de `GET /transacciones/resumen-por-categoria`: `propiedadId`,
`tipo`, `categoriaId`, `mes` (AAAA-MM).

`GET /transacciones` devuelve la lista ordenada de la más reciente a la más antigua.

`GuardarTransaccion` es `Transaccion` sin `id`, `propiedadNombre` ni `categoriaNombre`. Validaciones:
`monto` mayor que 0; la categoría debe ser del mismo `tipo` que la transacción; si viene
`contratoId`, el contrato debe pertenecer a la misma propiedad.

`ResumenCategoria`:

```json
[{ "categoria": "Canon de arriendo", "tipo": "INGRESO", "total": 46200000 }]
```

Ordenado de mayor a menor `total`.

---

## Categorías

| Método | Ruta | Cuerpo | Respuesta | Quién |
| --- | --- | --- | --- | --- |
| `GET` | `/categorias` | | `Categoria[]` | Todos |
| `POST` | `/categorias` | `GuardarCategoria` | `201` `Categoria` | `ADMIN` |
| `PUT` | `/categorias/:id` | `GuardarCategoria` | `Categoria` | `ADMIN` |
| `DELETE` | `/categorias/:id` | | `204` | `ADMIN` |

Filtro de `GET /categorias`: `tipo`.

`GuardarCategoria`: `{ "nombre": "Seguros", "tipo": "GASTO" }`. El nombre no se puede repetir:
`409`. Una categoría que ya usan transacciones no se puede eliminar: `409`.

La primera vez que arranca la API se crean las categorías iniciales (canon de arriendo, corta
estancia, administración, mantenimiento, servicios públicos, aseo, etc.).

---

## Usuarios (solo `ADMIN`)

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| `GET` | `/usuarios` | | `Usuario[]` |
| `DELETE` | `/usuarios/:id` | | `204` |
| `GET` | `/usuarios/resumen-por-rol` | | `ResumenRol[]` |

Filtro de `GET /usuarios`: `rol`.

`ResumenRol`:

```json
[{ "rol": "PROPIETARIO", "cantidad": 21 }, { "rol": "ADMIN", "cantidad": 3 }]
```

Un `ADMIN` no puede eliminarse a sí mismo: `409`.
