<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import TarjetaGrafico from '@/components/base/TarjetaGrafico.vue'
import TarjetaKpi from '@/components/base/TarjetaKpi.vue'
import GraficoBarras from '@/components/graficos/GraficoBarras.vue'
import TablaDatos from '@/components/tabla/TablaDatos.vue'
import { useConsulta } from '@/composables/useConsulta'
import type { Columna } from '@/interfaces/OpcionInterface'
import type { ReporteGlobal } from '@/interfaces/ReporteInterface'
import { ReporteService } from '@/services/ReporteService'
import { formatearPesos } from '@/utils/formato'
import { COLORES } from '@/utils/paleta'

const COLUMNAS: Columna[] = [
  { clave: 'nombre', titulo: 'Propietario' },
  { clave: 'propiedades', titulo: 'Propiedades', alineacion: 'derecha' },
  { clave: 'contratosActivos', titulo: 'Contratos activos', alineacion: 'derecha' },
  { clave: 'ingresos', titulo: 'Ingresos', alineacion: 'derecha' },
  { clave: 'gastos', titulo: 'Gastos', alineacion: 'derecha' },
  { clave: 'utilidad', titulo: 'Utilidad', alineacion: 'derecha' },
]

const REPORTE_VACIO: ReporteGlobal = {
  totales: { propiedades: 0, contratosActivos: 0, ingresos: 0, gastos: 0, utilidad: 0 },
  propietarios: [],
}

const reporte = useConsulta(() => ReporteService.obtenerReporte(), REPORTE_VACIO)

const totales = computed(() => reporte.datos.value.totales)
const propietarios = computed(() => reporte.datos.value.propietarios)
const nombres = computed(() => propietarios.value.map((fila) => fila.nombre))
const utilidades = computed(() => propietarios.value.map((fila) => fila.utilidad))
// Verde si el propietario gana, rojo si pierde.
const coloresUtilidad = computed(() =>
  utilidades.value.map((utilidad) => (utilidad >= 0 ? COLORES.ingreso : COLORES.gasto)),
)

onMounted(reporte.cargar)
</script>

<template>
  <EncabezadoPagina
    titulo="Reporte global"
    descripcion="El negocio de todos los propietarios: propiedades, contratos activos y utilidad."
  />

  <AvisoError :mensaje="reporte.error.value" />

  <section aria-label="Totales del negocio" class="flex flex-wrap gap-4">
    <TarjetaKpi etiqueta="Propiedades" :valor="String(totales.propiedades)" />
    <TarjetaKpi etiqueta="Contratos activos" :valor="String(totales.contratosActivos)" />
    <TarjetaKpi etiqueta="Ingresos" :valor="formatearPesos(totales.ingresos)" />
    <TarjetaKpi etiqueta="Utilidad neta" :valor="formatearPesos(totales.utilidad)" destacada />
  </section>

  <section class="tarjeta overflow-hidden">
    <TablaDatos
      :columnas="COLUMNAS"
      :filas="propietarios"
      :cargando="reporte.cargando.value"
      :acciones="[]"
      mensaje-vacio="Todavía no hay propietarios registrados."
    >
      <template #celda-nombre="{ fila }">
        <div class="font-semibold">{{ fila.nombre }}</div>
        <div class="text-xs text-apagado">{{ fila.correo }}</div>
      </template>
      <template #celda-ingresos="{ fila }">{{ formatearPesos(fila.ingresos) }}</template>
      <template #celda-gastos="{ fila }">{{ formatearPesos(fila.gastos) }}</template>
      <template #celda-utilidad="{ fila }">
        <span class="font-bold" :class="fila.utilidad >= 0 ? 'text-ingreso' : 'text-gasto'">
          {{ formatearPesos(fila.utilidad) }}
        </span>
      </template>
    </TablaDatos>
  </section>

  <TarjetaGrafico
    titulo="Utilidad por propietario"
    subtitulo="Ingresos menos gastos de todas sus propiedades"
    :hay-datos="nombres.length > 0"
  >
    <GraficoBarras :etiquetas="nombres" :valores="utilidades" :colores="coloresUtilidad" />
  </TarjetaGrafico>
</template>
