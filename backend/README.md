# Backend de KeyRing

API REST en **Nest.js** + **TypeORM** + **SQLite**, con el prefijo `/api`. Responde exactamente lo
que describe [`../docs/CONTRATO-API.md`](../docs/CONTRATO-API.md), que es lo que el frontend ya
consume.

## Requisitos

- **Node.js 22.18 o superior** (o 24). Con versiones anteriores, el `nest` de la línea de comandos
  falla al arrancar con el error `ERR_REQUIRE_CYCLE_MODULE`.
- npm

## Cómo correrlo

```bash
cd backend
npm install
cp .env.example .env      # y cambia los valores (ver la tabla de abajo)
npm run start:dev
```

La API queda en `http://localhost:3000/api`. La primera vez que arranca:

- crea el archivo `database.sqlite` con sus cuatro tablas (`usuario`, `propiedad`, `contrato`,
  `transaccion`);
- crea el **primer administrador** con `ADMIN_CORREO` y `ADMIN_CONTRASENA`.

No crea propiedades, contratos ni transacciones: esos los registra cada usuario.

### Variables de entorno

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `JWT_SECRETO` | Sí | Clave para firmar los tokens. Sin ella la API no arranca. Texto largo y aleatorio. |
| `ADMIN_CORREO`, `ADMIN_CONTRASENA` | La primera vez | Datos del primer administrador. |
| `ADMIN_NOMBRE` | No | Nombre del primer administrador. |
| `PORT` | No | Puerto (por defecto `3000`). |
| `CORS_ORIGIN` | No | Direcciones del front que pueden llamar a la API, separadas por coma. |
| `SQLITE_PATH` | No | Dónde guardar la base de datos (en Docker, en un volumen). |

### Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run start:dev` | Arranca y se reinicia solo al guardar cambios |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Corre lo compilado (`node dist/main.js`) |
| `npm run format` | Formatea con Prettier |

---

## Estructura

Un módulo por recurso. Cada módulo tiene siempre las mismas piezas, y cada pieza un solo trabajo:

```
src/
├── main.ts                 Arranque: CORS, prefijo /api y validación de todo lo que llega
├── app.module.ts           Une los módulos, la base de datos, JWT y el guard global
├── entorno.ts              Carga el .env antes que todo lo demás
├── comun/                  Lo que usan todos los módulos
│   ├── autenticacion.guard.ts   Revisa el token (y el rol) en cada petición
│   ├── decoradores.ts           @Publica(), @SoloAdmin(), @UsuarioActual()
│   ├── sesion.ts                Qué va dentro del token
│   └── validaciones.ts          @EsFecha() y @EsMes()
├── autenticacion/          POST /auth/ingresar y POST /auth/registrarse
├── usuarios/               Cuentas y roles (rutas solo para ADMIN)
├── propiedades/
├── contratos/
├── transacciones/          También la lista fija de categorías (CATEGORIAS)
└── tablero/                Los números del dashboard
```

| Pieza | Trabajo |
| --- | --- |
| `entities/*.entity.ts` | La tabla: columnas, relaciones y reglas (`CHECK`) de la base de datos |
| `dto/*.dto.ts` | Qué datos acepta una ruta y cómo se validan (`class-validator`) |
| `*.service.ts` | La lógica: consultas, reglas de negocio, cálculos. Lanza los errores (404, 409…) |
| `*.controller.ts` | Las rutas. Solo recibe, llama al servicio y responde |
| `*.module.ts` | Junta las piezas del módulo y dice qué comparte con otros |

---

## Cómo funciona el login

Sigue la versión clásica de la guía oficial de Nest: <https://docs.nestjs.com/security/authentication>.
La comparación paso a paso con la guía, y la justificación de cada cosa que se agregó, está en
[`../docs/AUTENTICACION.md`](../docs/AUTENTICACION.md).

```
1. El front envía correo y contraseña  ─►  POST /api/auth/ingresar
2. AutenticacionService busca el usuario y compara la contraseña con su hash (bcrypt)
3. Si coinciden, firma un token JWT con { sub: id, rol } que dura 8 horas
4. El front guarda el token y lo envía en cada petición: Authorization: Bearer <token>
5. AutenticacionGuard (global) revisa ese token antes de que la petición llegue al controlador
6. El guard busca al usuario del token: si ya no existe (lo eliminó un ADMIN) responde 401,
   y el rol que usa es el de la base de datos, no el del token
```

**El guard protege todas las rutas por defecto.** Para cambiar eso se usan dos decoradores:

| Decorador | Efecto | Dónde se usa |
| --- | --- | --- |
| `@Publica()` | La ruta no pide token | Login y registro |
| `@SoloAdmin()` | Además del token, exige el rol `ADMIN` | Usuarios |

Dentro de un controlador, `@UsuarioActual()` entrega el usuario del token. Así cada servicio
filtra por dueño y **un propietario nunca ve los datos de otro**: si pide una propiedad ajena, la
respuesta es 404, igual que si no existiera.

Las contraseñas nunca se guardan: solo su hash. La columna del hash tiene `select: false`, así que
no sale en ninguna respuesta; solo se pide a propósito al iniciar sesión.

**Registro:** `POST /api/auth/registrarse` crea una cuenta `PROPIETARIO` y deja la sesión
iniciada. El porqué de esta decisión está en [`../docs/DECISIONES.md`](../docs/DECISIONES.md)
(D1).

---

## Reglas de negocio que revisa el back

| Regla | Respuesta si se rompe |
| --- | --- |
| Sin token, con token vencido o de una cuenta eliminada | `401` |
| Ruta de ADMIN usada por un PROPIETARIO | `403` |
| Recurso que no existe o es de otro usuario | `404` |
| Campo inválido o de más en el cuerpo | `400` con el nombre del campo |
| Contrato con fecha de fin antes de la de inicio | `400` |
| Transacción con una categoría que no existe o de otro tipo (ingreso/gasto) | `400` |
| Transacción con un contrato de otra propiedad | `400` |
| Correo ya registrado | `409` |
| Eliminar una propiedad con contratos o transacciones | `409` |
| Un ADMIN se intenta eliminar a sí mismo | `409` |

Al eliminar un usuario se eliminan en cascada sus propiedades, contratos y transacciones. Al
eliminar un contrato, sus transacciones se conservan sin contrato.

Las reglas de código son las mismas de [`../GUIA-DE-CODIGO.md`](../GUIA-DE-CODIGO.md).
