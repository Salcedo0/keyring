# Autenticación: la guía de Nest frente a KeyRing

Este documento compara, paso a paso, la guía oficial de autenticación de Nest
(<https://docs.nestjs.com/security/authentication>) con lo que tiene KeyRing, y justifica cada
cosa que se agregó. Está pensado para la sustentación.

## Antes de empezar: la guía cambió el 29 de septiembre de 2026

La página de la guía **se reescribió por completo el 29 de septiembre de 2026**
(commit [`5498a5e`](https://github.com/nestjs/docs.nestjs.com/commit/5498a5e74c35) del repositorio
de la documentación). Ahora usa un paquete nuevo, `@nestjs/authentication`, con sesiones por cookie,
tokens de refresco y verificación de correo.

KeyRing sigue la **versión clásica** de la guía, la que estuvo publicada hasta el 22 de septiembre
(commit [`96f330a`](https://github.com/nestjs/docs.nestjs.com/blob/96f330a29cbf/content/security/authentication.md)).
Es la que corresponde a lo que pide el entregable y la que usa el curso: `@nestjs/jwt`, un
`AuthGuard` propio y el decorador `@Public()`.

**¿Por qué no se usó el paquete nuevo?**

- `@nestjs/authentication` está en la versión **0.1.0** y se publicó el **29 de septiembre de
  2026**. Una versión 0.x todavía puede cambiar de forma incompatible.
- La versión clásica muestra **cómo funciona** la autenticación por dentro (firmar el token,
  leerlo en el guard, marcar rutas públicas). El paquete nuevo lo esconde detrás de clases ya
  hechas. Para un curso, lo primero se explica y se defiende mejor.
- Las dos versiones resuelven lo que pide el entregable: un login funcional que protege la API.

---

## Paso a paso: guía clásica → KeyRing

| # | Paso de la guía | Qué hace la guía | Qué hace KeyRing | ¿Igual? |
| --- | --- | --- | --- | --- |
| 1 | Crear `AuthModule`, `AuthController`, `AuthService` | `nest g module/controller/service auth` | `autenticacion/autenticacion.module.ts`, `.controller.ts`, `.service.ts` | Igual (nombres en español) |
| 2 | Crear `UsersModule` y `UsersService` | Lista de usuarios **escrita en el código** | Entidad `Usuario` en **SQLite con TypeORM** (`usuarios/`) | Cambia, ver A1 |
| 3 | `UsersModule` exporta `UsersService` | `exports: [UsersService]` | `exports: [UsuariosService]` | Igual |
| 4 | `AuthService.signIn()` | Compara la contraseña **en texto plano** | Compara con el **hash bcrypt** (`bcrypt.compare`) | Cambia, ver A2 |
| 5 | Quitar la contraseña de la respuesta | `const { password, ...result } = user` | La columna del hash tiene `select: false` y la respuesta arma solo `id, nombre, correo, rol` | Mismo fin |
| 6 | Ruta de login | `@HttpCode(200) @Post('login')` con `Record<string, any>` | `@HttpCode(200) @Post('ingresar')` con `IngresarDto` validado | Cambia, ver A3 |
| 7 | Instalar `@nestjs/jwt` | `npm install @nestjs/jwt` | Igual | Igual |
| 8 | Firmar el token | `signAsync({ sub, username })` → `{ access_token }` | `signAsync({ sub, rol })` → `{ token, usuario }` | Cambia, ver A4 |
| 9 | Clave secreta | `constants.ts` con la clave en el código | Variable de entorno **obligatoria** `JWT_SECRETO` | Cambia, ver A5 |
| 10 | `JwtModule.register` | `global: true`, `expiresIn: '60s'` | `global: true`, `expiresIn: '8h'` | Cambia, ver A6 |
| 11 | `AuthGuard` | Saca el token de `Authorization: Bearer`, lo verifica y lo guarda en `request['user']` | Igual, y además comprueba que el usuario exista y guarda su rol actual | Igual + ver A7 |
| 12 | Ruta protegida de ejemplo | `GET /auth/profile` devuelve `req.user` | No existe: todas las rutas del negocio son las protegidas | Ver A8 |
| 13 | Guard global | `{ provide: APP_GUARD, useClass: AuthGuard }` | Igual, en `AppModule` | Igual |
| 14 | Rutas públicas | `IS_PUBLIC_KEY` + `@Public()` con `SetMetadata` | `ES_PUBLICA` + `@Publica()` con `SetMetadata` | Igual (en español) |
| 15 | El guard deja pasar lo público | `reflector.getAllAndOverride(IS_PUBLIC_KEY, …)` | `reflector.getAllAndOverride(ES_PUBLICA, …)` | Igual |
| 16 | Passport | Opcional, en otra receta | No se usa | Igual (la guía no lo exige) |

**Resultado:** la estructura y el flujo son los de la guía. Los cambios son justamente los que la
propia guía pide hacer "en una aplicación real" (ver A1, A2, A3, A5 y A6).

---

## Lo que se agregó y por qué

### Cambios que la propia guía pide

**A1. Usuarios en base de datos, no en una lista fija.**
La guía usa una lista en memoria y aclara que es solo para el ejemplo: *"In a real app, this is
where you'd build your user model and persistence layer, using your library of choice (e.g.,
TypeORM…)"*. KeyRing usa TypeORM y SQLite, como el resto del curso.

**A2. Contraseñas con hash (bcrypt).**
La guía advierte: *"A real application must never store passwords in plain text… use a library
such as bcrypt"*. KeyRing guarda solo el hash. Se usa `bcryptjs`, que funciona igual que `bcrypt`
pero no necesita compilar nada al instalarse (decisión D3 en [`DECISIONES.md`](DECISIONES.md)).

**A3. DTO validado en el login.**
La guía usa `Record<string, any>` y dice: *"In a real application, use a DTO class instead"*.
KeyRing usa `IngresarDto` y `RegistrarseDto` con `class-validator`. Un correo mal escrito responde
400 antes de llegar al servicio.

**A5. La clave secreta fuera del código.**
La guía pone la clave en `constants.ts` y advierte: *"you must protect this key using…
environment variable"*. En KeyRing la clave sale de `JWT_SECRETO`, y **la API no arranca si
falta**. Así nunca se despliega con una clave de ejemplo.

**A6. El token dura 8 horas, no 60 segundos.**
La guía usa 60 segundos solo para demostrar que el token vence, y aclara: *"That is too short for
a real application"*. 8 horas es una jornada de trabajo. Los tokens de refresco no se usan porque
la guía los deja fuera de su alcance y el proyecto no los necesita (KISS).

### Agregados propios del proyecto

**A4. El login responde también el usuario.**
La guía responde solo `{ access_token }`. KeyRing responde `{ token, usuario }`, porque el front
necesita el nombre y el rol para pintar la barra superior y decidir si muestra el menú de
administración. Así se evita una segunda petición al iniciar sesión. El token lleva `rol` en vez
de `username` por la misma razón.

**A7. El guard comprueba que el usuario todavía exista.**
Un JWT sigue siendo válido hasta que vence, aunque el ADMIN haya eliminado la cuenta. En las
pruebas, el token de un usuario eliminado seguía leyendo datos (200) y al crear una propiedad la
API fallaba con un error 500. Por eso el guard busca al usuario en cada petición: si ya no existe,
responde 401 con *"Tu cuenta ya no existe"*. Además el rol se toma de la base de datos y no del
token, así un cambio de rol aplica de inmediato. Es una consulta por id (llave primaria), muy
barata. La guía nueva de Nest hace lo mismo y lo explica así: *"a deleted user loses access right
away, not when the session expires"*.

**A8. No hay `GET /auth/profile`.**
En la guía esa ruta solo sirve para demostrar que el guard funciona. En KeyRing todas las rutas
del negocio (propiedades, contratos, transacciones…) están protegidas, y el usuario ya llega en la
respuesta del login (A4). Una ruta que nadie usa sería código muerto.

**A9. Registro de propietarios (`POST /auth/registrarse`).**
La guía no tiene registro porque sus usuarios están escritos en el código. KeyRing necesita una
forma de crear cuentas. Se eligió el registro público (decisión D1 en
[`DECISIONES.md`](DECISIONES.md)). El registro solo crea cuentas `PROPIETARIO` y deja la sesión
iniciada.

**A10. Roles con `@SoloAdmin()` dentro del mismo guard.**
La guía de autenticación no trata roles; el capítulo de autorización de Nest propone un
`RolesGuard` aparte con `@Roles()`. KeyRing solo tiene dos roles, así que el mismo guard revisa la
marca `@SoloAdmin()` con el mismo `Reflector`, en tres líneas. Un segundo guard sería más código
para lo mismo (KISS).

**A11. `@UsuarioActual()` en vez de `@Request() req`.**
La guía lee el usuario con `@Request() req` y `req.user`, que no tienen tipo. KeyRing usa un
decorador de parámetro (capítulo "Custom decorators" de Nest) que entrega un `UsuarioDelToken`
tipado. El controlador queda más corto y TypeScript avisa si se usa mal.

**A12. Cada usuario solo ve lo suyo.**
Esto ya es autorización, no autenticación, pero depende del token: cada servicio filtra por el id
del usuario. Si alguien pide una propiedad de otro, la respuesta es 404, igual que si no existiera,
para no revelar qué ids tienen los demás.

**A13. Detalles de seguridad pequeños.**

- Mismo mensaje para "el correo no existe" y "la contraseña es incorrecta"
  (*"Correo o contraseña incorrectos"*), para no revelar qué correos están registrados.
- El correo se guarda en minúsculas y sin espacios: `Ana@Correo.co` y `ana@correo.co` son la misma
  cuenta.
- El primer ADMIN se crea desde variables de entorno la primera vez que arranca la API. Nunca por
  registro.

### Del lado del front (Vue)

La guía termina en el back: *"JavaScript clients (such as Angular, React, or Vue apps)… can now
authenticate"*. Lo que hace el front de KeyRing para cerrar el ciclo:

| Pieza | Qué hace |
| --- | --- |
| `services/http.ts` | Agrega `Authorization: Bearer <token>` a cada petición. Si la API responde 401, cierra la sesión y lleva al login. |
| `utils/almacenSesion.ts` | Guarda token y usuario en `localStorage` para no perder la sesión al recargar. Es el único uso de `localStorage`. |
| `composables/useSesion.ts` | Usuario actual, `esAdmin`, iniciar sesión, crear cuenta y cerrar sesión. |
| `router/index.ts` | Sin sesión, las páginas internas llevan al login; sin rol ADMIN, las de administración llevan al dashboard. |
| `views/IngresoView.vue` | Después del login vuelve a la página que se pidió, pero solo si es una ruta interna (evita redirecciones a otros sitios). |

El front **no es la seguridad**: solo esconde lo que el usuario no puede usar. La seguridad real es
el guard del back, que revisa cada petición.

---

## Cómo demostrarlo en la sustentación

Con la API corriendo (`npm run start:dev` en `backend/`):

```bash
# 1. Sin token: 401
curl http://localhost:3000/api/propiedades

# 2. Login: responde { token, usuario }
curl -X POST http://localhost:3000/api/auth/ingresar -H "Content-Type: application/json" -d "{\"correo\":\"admin@keyring.co\",\"contrasena\":\"<la del .env>\"}"

# 3. Con token: 200
curl http://localhost:3000/api/propiedades -H "Authorization: Bearer <token>"

# 4. Ruta de ADMIN con un token de PROPIETARIO: 403
curl http://localhost:3000/api/usuarios -H "Authorization: Bearer <token de propietario>"
```

También se ve en el navegador: abrir `/dashboard` sin sesión lleva al login, y un PROPIETARIO no
ve el menú de administración.
