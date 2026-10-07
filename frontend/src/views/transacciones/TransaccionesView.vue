<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import Icono from '@/components/base/Icono.vue'
import InsigniaEstado from '@/components/base/InsigniaEstado.vue'
import TarjetaGrafico from '@/components/base/TarjetaGrafico.vue'
import CampoTexto from '@/components/formulario/CampoTexto.vue'
import FiltroSelector from '@/components/formulario/FiltroSelector.vue'
import GraficoBarras from '@/components/graficos/GraficoBarras.vue'
import TablaDatos from '@/components/tabla/TablaDatos.vue'
import { useConsulta } from '@/composables/useConsulta'
import type { Columna } from '@/interfaces/OpcionInterface'
import type { FiltrosTransacciones, Transaccion } from '@/interfaces/TransaccionInterface'
import { obtenerCategorias } from '@/services/CategoriaService'
import { describirError } from '@/services/http'
import { obtenerPropiedades } from '@/services/PropiedadService'
import {
  eliminarTransaccion,
  obtenerResumenPorCategoria,
  obtenerTransacciones,
} from '@/services/TransaccionService'
import { aOpcionesConTodos, TIPOS_TRANSACCION, TONOS_TRANSACCION } from '@/utils/etiquetas'
import { formatearFecha, formatearMonto } from '@/utils/formato'
import { COLORES } from '@/utils/paleta'

const COLUMNAS: Columna[] = [
  { clave: 'fecha', titulo: 'Fecha' },
  { clave: 'propiedadNombre', titulo: 'Propiedad' },
  { clave: 'descripcion', titulo: 'Descripción' },
  { clave: 'categoriaNombre', titulo: 'Categoría' },
  { clave: 'tipo', titulo: 'Tipo' },
  { clave: 'monto', titulo: 'Monto', alineacion: 'derecha' },
]

const OPCIONES_TIPO = aOpcionesConTodos(TIPOS_TRANSACCION, 'Ingresos y gastos')

const router = useRouter()
const filtros = reactive<FiltrosTransacciones>({
  propiedadId: null,
  tipo: null,
  categoriaId: null,
  mes: '',
})
const errorAccion = ref('')

const propiedades = useConsulta(obtenerPropiedades, [])
const categorias = useConsulta(obtenerCategorias, [])
const transacciones = useConsulta(() => obtenerTransacciones(filtros), [])
const resumen = useConsulta(() => obtenerResumenPorCategoria(filtros), [])

const opcionesPropiedad = computed(() => [
  { valor: null, texto: 'Todas las propiedades' },
  ...propiedades.datos.value.map((propiedad) => ({ valor: propiedad.id, texto: propiedad.nombre })),
])

// Si hay un tipo elegido, solo se ofrecen las categorías de ese tipo.
const opcionesCategoria = computed(() => [
  { valor: null, texto: 'Todas las categorías' },
  ...categorias.datos.value
    .filter((categoria) => filtros.tipo === null || categoria.tipo === filtros.tipo)
    .map((categoria) => ({ valor: categoria.id, texto: categoria.nombre })),
])

const nombresResumen = computed(() => resumen.datos.value.map((fila) => fila.categoria))
const totalesResumen = computed(() => resumen.datos.value.map((fila) => fila.total))
const coloresResumen = computed(() =>
  resumen.datos.value.map((fila) => (fila.tipo === 'INGRESO' ? COLORES.ingreso : COLORES.gasto)),
)

function recargar(): void {
  transacciones.cargar()
  resumen.cargar()
}

function editar(transaccion: Transaccion): void {
  router.push(`/transacciones/${transaccion.id}/editar`)
}

async function eliminar(transaccion: Transaccion): Promise<void> {
  if (!window.confirm(`¿Eliminar "${transaccion.descripcion}"? Esta acción no se puede deshacer.`))
    return
  errorAccion.value = ''
  try {
    await eliminarTransaccion(transaccion.id)
    recargar()
  } catch (error) {
    errorAccion.value = describirError(error, 'No se pudo eliminar la transacción.')
  }
}

onMounted(() => {
  propiedades.cargar()
  categorias.cargar()
  recargar()
})

// Al cambiar el tipo, la categoría elegida puede dejar de ser válida.
watch(
  () => filtros.tipo,
  () => (filtros.categoriaId = null),
)
watch(filtros, recargar)
</script>

<template>
  <EncabezadoPagina
    titulo="Transacciones"
    descripcion="Ingresos y gastos de todas tus propiedades."
  >
    <template #acciones>
      <RouterLink to="/transacciones/nueva" class="boton-primario">
        <Icono nombre="mas" :tamano="18" /> Nueva transacción
      </RouterLink>
    </template>
  </EncabezadoPagina>

  <section aria-label="Filtros" class="tarjeta flex flex-wrap items-end gap-4 p-5">
    <FiltroSelector
      v-model="filtros.propiedadId"
      etiqueta="Propiedad"
      :opciones="opcionesPropiedad"
    />
    <FiltroSelector v-model="filtros.tipo" etiqueta="Tipo" :opciones="OPCIONES_TIPO" />
    <FiltroSelector
      v-model="filtros.categoriaId"
      etiqueta="Categoría"
      :opciones="opcionesCategoria"
    />
    <div class="min-w-44 flex-1">
      <CampoTexto v-model="filtros.mes" etiqueta="Mes" tipo="month" />
    </div>
  </section>

  <AvisoError
    :mensaje="
      transacciones.error.value || resumen.error.value || propiedades.error.value || errorAccion
    "
  />

  <TarjetaGrafico
    titulo="Total por categoría"
    subtitulo="Con los filtros de arriba · pesos colombianos"
    :hay-datos="nombresResumen.length > 0"
  >
    <GraficoBarras
      :etiquetas="nombresResumen"
      :valores="totalesResumen"
      :colores="coloresResumen"
    />
  </TarjetaGrafico>

  <section class="tarjeta overflow-hidden">
    <div class="px-5 py-4"><h2 class="text-[17px] font-bold">Movimientos</h2></div>
    <TablaDatos
      :columnas="COLUMNAS"
      :filas="transacciones.datos.value"
      :cargando="transacciones.cargando.value"
      mensaje-vacio="Cuando registres ingresos o gastos aparecerán aquí."
      @editar="editar"
      @eliminar="eliminar"
    >
      <template #celda-fecha="{ fila }">{{ formatearFecha(fila.fecha) }}</template>
      <template #celda-propiedadNombre="{ fila }">
        <span class="font-semibold">{{ fila.propiedadNombre }}</span>
      </template>
      <template #celda-tipo="{ fila }">
        <InsigniaEstado
          :texto="TIPOS_TRANSACCION[fila.tipo]"
          :tono="TONOS_TRANSACCION[fila.tipo]"
        />
      </template>
      <template #celda-monto="{ fila }">
        <span
          class="font-bold tabular-nums"
          :class="fila.tipo === 'INGRESO' ? 'text-ingreso' : 'text-gasto'"
        >
          {{ formatearMonto(fila.monto, fila.tipo) }}
        </span>
      </template>
    </TablaDatos>
  </section>
</template>
