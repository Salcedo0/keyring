# Decisiones del proyecto

Registro de las decisiones importantes: qué se decidió, por qué y qué se descartó. Sirve para que
nadie del equipo tenga que adivinar el motivo de algo, y para defenderlo en la sustentación.

Cada decisión nueva se agrega al final con el siguiente número.

---

## D1. Las cuentas de propietario se crean con registro público

**Decisión:** cualquier persona puede crear su cuenta de `PROPIETARIO` desde la página
"Crear cuenta" (`/registrarse` en el front, `POST /api/auth/registrarse` en el back). Al
registrarse queda con la sesión iniciada.

**Por qué:**

- KeyRing es una herramienta para propietarios independientes: cada uno maneja sus propios
  inmuebles y no depende de una empresa que le cree el usuario.
- Es lo más simple que funciona: una pantalla y una ruta. La alternativa necesitaba un formulario
  extra para el ADMIN y una forma de entregarle la contraseña al propietario.
- Permite probar el login de punta a punta sin depender de que un ADMIN cree cuentas primero.

**Qué se descartó:** que el ADMIN cree las cuentas desde la pantalla de Usuarios. Tiene sentido si
KeyRing fuera para una sola inmobiliaria con empleados, que no es el caso.

**Cómo se protege:**

- El registro solo crea cuentas `PROPIETARIO`. Un `ADMIN` nunca se crea por registro: el primero
  sale de las variables de entorno (`ADMIN_CORREO`, `ADMIN_CONTRASENA`) la primera vez que arranca
  la API.
- La contraseña exige mínimo 8 caracteres y se guarda solo como hash (bcrypt), nunca en texto.
- Cada propietario ve únicamente sus propias propiedades, contratos y transacciones.

---

## D2. Login con JWT y un solo guard global

**Decisión:** se sigue la guía oficial de autenticación de Nest
(<https://docs.nestjs.com/security/authentication>) sin Passport: `AuthService` revisa correo y
contraseña y firma un token con `@nestjs/jwt`. Un único `AutenticacionGuard` registrado como
`APP_GUARD` protege todas las rutas.

**Por qué:**

- Con un guard global, una ruta nueva queda protegida por defecto. Lo que se marca es la excepción
  (`@Publica()` en login y registro), no al revés. Es más difícil olvidarse de proteger algo.
- El mismo guard revisa el rol con `@SoloAdmin()`. No hace falta un segundo guard para algo que
  cabe en tres líneas.
- Passport agrega una capa (estrategias) que en este proyecto no aporta nada: solo hay un tipo de
  login.

---

## D3. `bcryptjs` en vez de `bcrypt`

**Decisión:** las contraseñas se procesan con `bcryptjs`.

**Por qué:** hace exactamente lo mismo que `bcrypt` (el que menciona la guía de Nest) y tiene la
misma forma de usarse, pero está escrito en JavaScript puro. No necesita compilar nada al
instalarse, así que funciona igual en Windows, en Mac y en la imagen de Docker del servidor.

---

## D4. Los cálculos los hace el back

**Decisión:** los totales del dashboard, el resumen por categoría y el conteo por rol se calculan
en el back. El front solo los muestra.

**Por qué:** es una regla de negocio y debe vivir en un solo lugar. Si mañana hay una app móvil,
recibe los mismos números sin repetir la lógica. Además, el front queda sin datos propios, que es
lo que pide el Entregable 1 Parte 2 ("elimine los seeders").

---

## D5. Fechas guardadas como texto `AAAA-MM-DD`

**Decisión:** las fechas de contratos y transacciones se guardan y viajan como texto
(`2026-09-30`), no como fecha con hora.

**Por qué:** una fecha con hora se corre un día según la zona horaria del servidor o del
navegador (Colombia es UTC−5). Como texto, el 30 de septiembre siempre es el 30 de septiembre.
Además el formato `AAAA-MM-DD` se ordena y se compara bien como texto, así que los filtros por mes
y por rango funcionan sin conversiones.

---

## D6. El guard comprueba en cada petición que el usuario todavía exista

**Decisión:** después de verificar el token, `AutenticacionGuard` busca al usuario por su id. Si ya
no existe responde 401, y el rol que usa para `@SoloAdmin()` es el de la base de datos, no el del
token.

**Por qué:** un JWT sigue siendo válido hasta que vence (8 horas), aunque el ADMIN haya eliminado
la cuenta. En las pruebas, el token de un usuario eliminado seguía leyendo datos y al crear una
propiedad la API fallaba con un error 500. Con la comprobación, el usuario eliminado pierde el
acceso de inmediato, y un cambio de rol aplica en la siguiente petición.

**Costo:** una consulta por llave primaria en cada petición, que en SQLite es instantánea.

**Qué se descartó:** dejar que el token venza solo (deja la ventana de 8 horas) o usar tokens de
muy corta duración con tokens de refresco (mucho más código para el mismo resultado).

---

## D7. Se sigue la versión clásica de la guía de autenticación de Nest

**Decisión:** el login sigue la guía clásica (`@nestjs/jwt`, `AuthGuard` propio, `@Public()`), no
el paquete nuevo `@nestjs/authentication` que la guía empezó a usar el 29 de septiembre de 2026.

**Por qué:** el paquete nuevo está en la versión 0.1.0 (recién publicado) y esconde el
funcionamiento detrás de clases ya hechas. La versión clásica muestra cada paso y es la que
corresponde al curso. La comparación completa está en [`AUTENTICACION.md`](AUTENTICACION.md).

---

## D8. El modelo tiene solo cuatro clases

**Contexto:** el docente puso como reto que el dominio de la aplicación (el diagrama de clases y las
tablas) tenga **solo cuatro clases**. Antes había seis: `Usuario`, `Propiedad`, `Contrato`,
`Transaccion`, `Categoria` y `Inquilino` (una clase incrustada dentro de `Contrato`).

**Decisión:** quedan `Usuario`, `Propiedad`, `Contrato` y `Transaccion`.

- **`Categoria` dejó de ser una tabla.** Ahora es una lista fija (`CATEGORIAS`, en
  `transaccion.entity.ts`) y cada transacción guarda el nombre de su categoría. La lista sale por
  `GET /transacciones/categorias`, así que el front la sigue recibiendo del back. El back revisa
  que la categoría exista y que sea del mismo tipo (ingreso o gasto) que la transacción.
- **`Inquilino` dejó de ser una clase.** Sus datos son columnas de `Contrato`
  (`inquilinoNombre`, `inquilinoDocumento`, `inquilinoCorreo`, `inquilinoTelefono`). En la base de
  datos las columnas ya se llamaban así, solo cambió el código y la forma del JSON.

**Por qué esas dos:** son las únicas que no son el centro del negocio. Una propiedad se arrienda
con contratos y produce transacciones; el usuario es quien inicia sesión. La categoría es solo una
etiqueta para clasificar, y el inquilino nunca existió sin un contrato (no tenía tabla propia).
Quitar `Contrato` habría roto la mitad del front; quitar estas dos casi no se nota.

**Lo que se perdió:** la pantalla de administración de categorías. El ADMIN ya no puede crear
categorías desde la aplicación; para agregar una se agrega a la lista en el código. Con diez
categorías fijas se cubren los ingresos y gastos de un arriendo, así que es un costo pequeño.

**Lo que no cambió:** login, roles, dashboard, gráficos, filtros y la regla de que cada propietario
solo ve lo suyo.
