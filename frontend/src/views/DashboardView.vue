<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import Icono from '@/components/base/Icono.vue'
import InsigniaEstado from '@/components/base/InsigniaEstado.vue'
import TarjetaGrafico from '@/components/base/TarjetaGrafico.vue'
import TarjetaKpi from '@/components/base/TarjetaKpi.vue'
import CampoTexto from '@/components/formulario/CampoTexto.vue'
import FiltroSelector from '@/components/formulario/FiltroSelector.vue'
import GraficoDona from '@/components/graficos/GraficoDona.vue'
import GraficoLineas from '@/components/graficos/GraficoLineas.vue'
import TablaDatos from '@/components/tabla/TablaDatos.vue'
import { useConsulta } from '@/composables/useConsulta'
import { useSesion } from '@/composables/useSesion'
import type { Columna } from '@/interfaces/OpcionInterface'
import type { FiltrosTablero, ResumenTablero } from '@/interfaces/TableroInterface'
import type { Transaccion } from '@/interfaces/TransaccionInterface'
import { describirError } from '@/services/http'
import { obtenerPropiedades } from '@/services/PropiedadService'
import { obtenerResumenTablero } from '@/services/TableroService'
import { eliminarTransaccion } from '@/services/TransaccionService'
import { TIPOS_TRANSACCION, TONOS_TRANSACCION } from '@/utils/etiquetas'
import { hoy, inicioDeMesHace } from '@/utils/fechas'
import { formatearFecha, formatearMes, formatearMonto, formatearPesos } from '@/utils/formato'
import { COLORES } from '@/utils/paleta'

// Lo que se muestra antes de que responda el back (o si no hay datos).
const RESUMEN_VACIO: ResumenTablero = {
  indicadores: { ingresos: 0, gastos: 0, utilidadNeta: 0, contratosActivos: 0 },
  porMes: [],
  gastosPorCategoria: [],
  ultimasTransacciones: [],
}

const COLUMNAS: Columna[] = [
  { clave: 'fecha', titulo: 'Fecha' },
  { clave: 'propiedadNombre', titulo: 'Propiedad' },
  { clave: 'descripcion', titulo: 'Descripción' },
  { clave: 'categoriaNombre', titulo: 'Categoría' },
  { clave: 'tipo', titulo: 'Tipo' },
  { clave: 'monto', titulo: 'Monto', alineacion: 'derecha' },
]

const router = useRouter()
const { usuario } = useSesion()

// Por defecto se ven los últimos seis meses, incluido el actual.
const filtros = reactive<FiltrosTablero>({
  propiedadId: null,
  desde: inicioDeMesHace(5),
  hasta: hoy(),
})
const errorAccion = ref('')

const propiedades = useConsulta(obtenerPropiedades, [])
const resumen = useConsulta(() => obtenerResumenTablero(filtros), RESUMEN_VACIO)

const saludo = computed(() => `Hola, ${usuario.value?.nombre.split(' ')[0] ?? ''}`)

const opcionesPropiedad = computed(() => [
  { valor: null, texto: 'Todas las propiedades' },
  ...propiedades.datos.value.map((propiedad) => ({ valor: propiedad.id, texto: propiedad.nombre })),
])

const indicadores = computed(() => resumen.datos.value.indicadores)

const etiquetasMeses = computed(() => resumen.datos.value.porMes.map((m) => formatearMes(m.mes)))
const nombresCategorias = computed(() =>
  resumen.datos.value.gastosPorCategoria.map((g) => g.categoria),
)
const totalesCategorias = computed(() => resumen.datos.value.gastosPorCategoria.map((g) => g.total))

const seriesPorMes = computed(() => [
  {
    nombre: 'Ingresos',
    color: COLORES.ingreso,
    valores: resumen.datos.value.porMes.map((m) => m.ingresos),
  },
  {
    nombre: 'Gastos',
    color: COLORES.gasto,
    valores: resumen.datos.value.porMes.map((m) => m.gastos),
  },
])

const margen = computed(() => {
  const { ingresos, utilidadNeta } = indicadores.value
  if (ingresos === 0) return 'Sin ingresos en el periodo'
  return `Margen ${Math.round((utilidadNeta / ingresos) * 100)}%`
})

function editarTransaccion(transaccion: Transaccion): void {
  router.push(`/transacciones/${transaccion.id}/editar`)
}

async function borrarTransaccion(transaccion: Transaccion): Promise<void> {
  if (!window.confirm(`¿Eliminar "${transaccion.descripcion}"? Esta acción no se puede deshacer.`))
    return
  errorAccion.value = ''
  try {
    await eliminarTransaccion(transaccion.id)
    await resumen.cargar()
  } catch (error) {
    errorAccion.value = describirError(error, 'No se pudo eliminar la transacción.')
  }
}

onMounted(() => {
  propiedades.cargar()
  resumen.cargar()
})

watch(filtros, resumen.cargar)
</script>

<template>
  <EncabezadoPagina
    :titulo="saludo"
    descripcion="Así va tu negocio de arriendos en el periodo elegido."
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
    <div class="min-w-44 flex-1">
      <CampoTexto v-model="filtros.desde" etiqueta="Desde" tipo="date" />
    </div>
    <div class="min-w-44 flex-1">
      <CampoTexto v-model="filtros.hasta" etiqueta="Hasta" tipo="date" />
    </div>
  </section>

  <AvisoError :mensaje="resumen.error.value || propiedades.error.value || errorAccion" />

  <section aria-label="Indicadores" class="flex flex-wrap gap-4">
    <TarjetaKpi etiqueta="Ingresos" :valor="formatearPesos(indicadores.ingresos)" />
    <TarjetaKpi etiqueta="Gastos" :valor="formatearPesos(indicadores.gastos)" />
    <TarjetaKpi
      etiqueta="Utilidad neta"
      :valor="formatearPesos(indicadores.utilidadNeta)"
      :nota="margen"
      destacada
    />
    <TarjetaKpi etiqueta="Contratos activos" :valor="String(indicadores.contratosActivos)" />
  </section>

  <section class="flex flex-wrap gap-5">
    <div class="min-w-0 flex-[2_1_520px]">
      <TarjetaGrafico
        titulo="Ingresos vs. gastos por mes"
        subtitulo="Pesos colombianos"
        :hay-datos="etiquetasMeses.length > 0"
      >
        <GraficoLineas :etiquetas="etiquetasMeses" :series="seriesPorMes" />
      </TarjetaGrafico>
    </div>
    <div class="min-w-0 flex-[1_1_340px]">
      <TarjetaGrafico
        titulo="Gastos por categoría"
        subtitulo="Total del periodo"
        :hay-datos="nombresCategorias.length > 0"
      >
        <GraficoDona :etiquetas="nombresCategorias" :valores="totalesCategorias" />
      </TarjetaGrafico>
    </div>
  </section>

  <section class="tarjeta overflow-hidden">
    <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <h2 class="text-[17px] font-bold">Últimas transacciones</h2>
      <RouterLink to="/transacciones" class="py-2.5 text-sm font-semibold text-marca">
        Ver todas →
      </RouterLink>
    </div>
    <TablaDatos
      :columnas="COLUMNAS"
      :filas="resumen.datos.value.ultimasTransacciones"
      :cargando="resumen.cargando.value"
      mensaje-vacio="Cuando registres ingresos o gastos aparecerán aquí."
      @editar="editarTransaccion"
      @eliminar="borrarTransaccion"
    >
      <template #celda-fecha="{ fila }">{{ formatearFecha(fila.fecha) }}</template>
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
