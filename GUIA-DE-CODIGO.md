# Guía de código de KeyRing

Reglas para escribir y editar el código de KeyRing. El objetivo es uno: que cualquier persona del
equipo pueda abrir cualquier archivo, entenderlo en minutos y cambiarlo sin miedo.

Si una regla de esta guía choca con "hacerlo más elegante", gana la regla.

---

## 1. Principios

1. **KISS: lo más simple que funcione.** Antes de agregar una abstracción, una librería o un
   patrón, pregúntate si un `if` o una función corta resuelven el problema. Casi siempre sí.
2. **Legible antes que ingenioso.** El código se lee muchas más veces de las que se escribe.
   Nada de trucos de una línea que haya que descifrar.
3. **Una responsabilidad por archivo y por función.** Si para describir lo que hace una función
   necesitas la palabra "y", probablemente son dos funciones.
4. **Nada de código espagueti.** Cada capa tiene un trabajo y solo habla con la capa que le toca
   (ver sección 3). Si una vista empieza a armar URLs o a leer `localStorage`, algo está mal.
5. **Coherencia total.** Mismo idioma, mismos nombres, misma forma de hacer lo mismo en todo el
   proyecto. Si ya existe una manera de hacer algo, se reutiliza; no se inventa otra.

---

## 2. Idioma y nombres

### Todo lo que escribimos va en español

Variables, funciones, componentes, archivos, comentarios, mensajes de la interfaz, mensajes de
error y commits: **en español**. Nunca se mezclan idiomas dentro del código propio: si la función
se llama `obtenerPropiedades`, su comentario también está en español.

| Se escribe en español | Se queda como lo define la herramienta |
| --- | --- |
| `obtenerPropiedades`, `cargando`, `errores` | `ref`, `computed`, `watch`, `onMounted` |
| `PropiedadService.ts`, `TablaDatos.vue` | `defineProps`, `defineEmits`, `defineModel` |
| Comentarios y documentación | El prefijo `use` de los composables (`useSesion`) |
| Mensajes para el usuario | Las carpetas estándar del curso: `components`, `services`, `views`… |
| Valores de enums (`'ACTIVO'`, `'GASTO'`) | Los sufijos de rol del curso: `View`, `Service`, `Interface`, `DTO` |

- **Sin tildes ni eñes en identificadores ni nombres de archivo** (`contrasena`, `categoria`,
  `Transaccion`). En los textos que ve el usuario sí van todas las tildes.
- Los sufijos `View`, `Service`, `Interface` y `DTO` se mantienen porque son la convención del curso
  y dicen de un vistazo qué papel cumple el archivo.

### Convenciones

| Elemento | Formato | Ejemplo |
| --- | --- | --- |
| Componente Vue | PascalCase | `TarjetaKpi.vue` |
| Vista (página) | PascalCase + `View` | `ContratosView.vue` |
| Servicio | PascalCase + `Service` | `ContratoService.ts` |
| Tipos de datos | PascalCase + `Interface` | `ContratoInterface.ts` |
| Datos que se envían al back | `Guardar…DTO` | `GuardarContratoDTO.ts` |
| Composable | `use` + PascalCase | `useConsulta.ts` |
| Función, variable | camelCase | `cargarContratos`, `filtroEstado` |
| Constante global | MAYÚSCULAS | `MODALIDADES`, `COLORES` |
| Booleano | empieza por `es`, `esta`, `tiene`, `hay` | `esAdmin`, `estaCargando`, `hayErrores` |

### Verbos para funciones

Usa siempre el mismo verbo para la misma acción:

- `obtener…`: pide datos al back (`obtenerContratos`).
- `crear…`, `actualizar…`, `eliminar…`: escriben en el back.
- `cargar…`: una vista pide datos y actualiza su estado (`cargarResumen`).
- `guardar…`: un formulario decide si crea o actualiza.
- `validar…`, `formatear…`, `alternar…`, `abrir…`, `cerrar…`.

---

## 3. Estructura del proyecto

```
keyring/
├── GUIA-DE-CODIGO.md        ← este archivo
├── README.md                ← qué es, cómo se corre, documentación
├── docs/
│   └── CONTRATO-API.md      ← lo que el back debe responder (la fuente de verdad)
├── backend/                 ← API en Nest (pendiente)
└── frontend/
    └── src/
        ├── assets/css/      ← estilos globales y colores de la marca
        ├── components/      ← piezas reutilizables, sin llamadas al back
        │   ├── base/        ← logo, íconos, tarjetas, insignias, avisos
        │   ├── formulario/  ← campos, selectores y grupos de opciones
        │   ├── graficos/    ← líneas, barras, dona
        │   ├── layout/      ← menú lateral, barra superior, plantilla interna
        │   ├── mapa/        ← mapa de propiedades y selector de ubicación
        │   └── tabla/       ← tabla de datos con estado vacío
        ├── composables/     ← estado compartido (sesión) y lógica repetida (consultas)
        ├── dtos/            ← forma de los datos que se envían al back
        ├── interfaces/      ← forma de los datos que llegan del back
        ├── router/          ← rutas y protección por sesión y rol
        ├── services/        ← única capa que habla con la API
        ├── utils/           ← funciones puras: formato, fechas, validaciones, etiquetas
        └── views/           ← una vista por página
```

### Quién puede hablar con quién

```
views  ──►  components
  │
  └────►  services  ──►  http.ts  ──►  API (backend)
```

- **Las vistas** piden datos a los servicios, guardan el estado de la página y pasan datos a los
  componentes.
- **Los componentes** solo reciben `props` y emiten eventos. **Nunca llaman a un servicio.** Así se
  reutilizan en cualquier página.
- **Los servicios** son la única capa que conoce las URLs de la API. Cada función hace una sola
  petición y devuelve datos tipados.
- **`http.ts`** es el único lugar que sabe dónde está la API, cómo se envía el token y cómo se
  traduce un error a un mensaje en español.
- **`utils/`** son funciones puras: reciben datos y devuelven datos, sin estado ni peticiones.

---

## 4. Los datos vienen del back. Siempre.

El front **no inventa datos**:

- Prohibido dejar datos de ejemplo, "semillas" o listas fijas de propiedades, contratos, montos o
  usuarios en el código.
- Prohibido usar `localStorage` como base de datos. Solo se usa para guardar la sesión (token y
  usuario).
- Los cálculos de negocio (totales, utilidad, conteos por categoría o por rol) los hace **el back**.
  El front solo los muestra.
- Las únicas listas fijas permitidas son las de los **enums** del dominio (modalidades, estados,
  tipos) con su texto en español, en `utils/etiquetas.ts`.

Toda petición sigue este camino: `vista → servicio → http.ts → API`. La forma de cada respuesta
está escrita en `docs/CONTRATO-API.md`. **Si necesitas un dato nuevo, primero se agrega al
contrato** y después se escribe el servicio.

### Los cuatro estados de toda pantalla con datos

Cada pantalla que muestra datos del back maneja siempre estos cuatro casos:

1. **Cargando**: mientras llega la respuesta.
2. **Error**: mensaje claro en español (`AvisoError`).
3. **Vacío**: "No hay datos todavía" (`EstadoVacio`, ya incluido en `TablaDatos`).
4. **Con datos**.

Para no repetir esa lógica se usa `useConsulta`:

```ts
const { datos: contratos, cargando, error, cargar } = useConsulta(() => obtenerContratos(filtros), [])
onMounted(cargar)
```

---

## 5. Funciones

- **Cortas.** Como guía, menos de 25 líneas. Si crece, se divide en funciones con buen nombre.
- **Una tarea.** El nombre dice exactamente lo que hace.
- **Máximo 3 parámetros.** Si hacen falta más, se recibe un objeto.
- **Retorno temprano** en vez de `if` anidados. Nunca más de 2 niveles de anidación.
- **Sin efectos escondidos.** Una función que se llama `formatear…` no modifica nada; una que se
  llama `obtener…` no cambia el estado de la página.
- **Tipos explícitos** en parámetros y retorno de servicios y utilidades. Nada de `any`.

```ts
// Bien: un nombre claro, retorno temprano, una sola tarea.
export function formatearPesos(valor: number): string {
  if (!Number.isFinite(valor)) return '$0'
  return FORMATO_PESOS.format(valor)
}
```

---

## 6. Componentes y vistas Vue

- Siempre `<script setup lang="ts">`.
- Orden dentro del `<script setup>` (siempre el mismo, para encontrar todo rápido):
  1. `import`
  2. `props`, `emits` y `defineModel`
  3. estado (`ref`, `reactive`, `useConsulta`)
  4. valores calculados (`computed`)
  5. funciones
  6. ciclo de vida y `watch` (`onMounted`, `watch`)
- **El `template` no tiene lógica.** Nada de expresiones largas ni cálculos: se mueven a un
  `computed` con nombre.
- Props siempre tipadas. Eventos con nombre en español (`editar`, `eliminar`, `alternarColapso`).
- Un componente de más de ~200 líneas se divide.
- Una vista no debería pasar de ~250 líneas. Si pasa, extrae componentes.
- Crear y editar usan **la misma vista de formulario**: si la ruta trae `id`, se edita; si no, se
  crea.

---

## 7. Estilos

- Se usa **Tailwind**. Los colores de la marca están definidos una sola vez en
  `assets/css/principal.css` (`bg-petroleo`, `text-ingreso`, `text-gasto`…).
- **Prohibido escribir colores sueltos** (`#0E5160`) en componentes. Si falta un color, se agrega
  al tema.
- Los gráficos usan los mismos colores desde `utils/paleta.ts` (Chart.js no puede leer las clases
  de Tailwind). Si cambias un color de la marca, cámbialo en los dos archivos.
- Las clases que se repiten mucho tienen nombre propio en `principal.css`: `tarjeta`,
  `boton-primario`, `boton-secundario`, `boton-peligro`, `boton-icono`, `campo`, `etiqueta`.
- Primero escritorio, pero todo debe funcionar en el celular: tablas con scroll horizontal, menú
  lateral que se abre con el botón de menú.

---

## 8. Comentarios

- **En español, siempre.**
- Explican el **porqué**, no el qué. El qué ya lo dice el código.
- Cada función exportada de `services/` y `utils/` lleva una línea `/** … */` que dice qué hace.
- **No se deja código comentado.** Para eso está git.
- No se dejan `TODO` sueltos. Si algo queda pendiente, se anota en la sección "Pendientes" del
  `README.md`.

```ts
// Mal: repite lo que el código ya dice.
// suma los ingresos
total = total + ingreso

// Bien: explica una decisión que no es obvia.
// El back envía las fechas sin hora; se arman a mano para que la zona horaria no reste un día.
```

---

## 9. Errores y validaciones

- Los formularios **validan antes de enviar** y muestran el error debajo de cada campo.
- Los mensajes son en español, cortos y dicen cómo arreglarlo: "Ingresa un correo válido".
- El back también valida. El front nunca confía en que el back acepte datos inválidos, ni al revés.
- Los errores de red o del servidor se traducen a un mensaje en español en un solo lugar:
  `describirError` en `services/http.ts`.
- Si el back responde 401 (sesión vencida), `http.ts` cierra la sesión y lleva al login.

---

## 10. Formato

- **Prettier** formatea todo (`npm run format`). Configuración: 2 espacios, comillas simples, sin
  punto y coma, 100 caracteres por línea.
- Antes de subir cambios: `npm run type-check` y `npm run build` deben pasar sin errores.

---

## 11. Git

- **Commits en español**, en imperativo y con prefijo:
  - `feat:` nueva funcionalidad · `fix:` corrección · `docs:` documentación
  - `refactor:` cambio interno sin cambiar comportamiento · `style:` formato · `chore:` configuración
  - Ejemplo: `feat: filtrar contratos por estado`
- Un commit, un cambio. No mezclar un arreglo con una funcionalidad nueva.
- **Solo personas del equipo figuran como autores.** No se agregan herramientas de IA como
  contribuidoras ni como coautoras: nada de líneas `Co-Authored-By` de IA ni firmas automáticas.
- Nunca se suben `.env`, `node_modules` ni `dist` (ya están en `.gitignore`).

---

## 12. Lista de chequeo antes de subir un cambio

- [ ] Todo el código y los comentarios nuevos están en español.
- [ ] Ningún dato está escrito a mano en el front: todo viene de un servicio.
- [ ] La pantalla maneja los cuatro estados: cargando, error, vacío y con datos.
- [ ] Ninguna función pasa de ~25 líneas ni tiene más de 2 niveles de anidación.
- [ ] Los componentes no llaman servicios.
- [ ] No hay colores sueltos, código comentado ni `TODO`.
- [ ] `npm run type-check` y `npm run build` pasan.
- [ ] Si cambió un endpoint, se actualizó `docs/CONTRATO-API.md`.
- [ ] Se actualizó la documentación (sección 13).

---

## 13. Documentación

La documentación se escribe **al terminar cada cambio**, no "después". Un cambio sin documentar no
está terminado.

| Archivo | Qué contiene | Cuándo se actualiza |
| --- | --- | --- |
| `README.md` | Qué es KeyRing, cómo se instala y se corre, estructura y pendientes | Al agregar una página, un comando o una variable de entorno |
| `GUIA-DE-CODIGO.md` | Estas reglas | Cuando el equipo acuerda una regla nueva |
| `docs/CONTRATO-API.md` | Cada endpoint: método, ruta, filtros, cuerpo y respuesta | **Antes** de escribir un servicio nuevo o cambiar uno existente |
| `backend/README.md` | Cómo se corre el back y qué falta | Al empezar y avanzar el back |
| Comentarios `/** … */` | Qué hace cada función de `services/` y `utils/` | Al crear o cambiar la función |
