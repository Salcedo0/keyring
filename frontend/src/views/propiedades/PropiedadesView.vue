<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import Icono from '@/components/base/Icono.vue'
import InsigniaEstado from '@/components/base/InsigniaEstado.vue'
import TarjetaGrafico from '@/components/base/TarjetaGrafico.vue'
import MapaPropiedades from '@/components/mapa/MapaPropiedades.vue'
import TablaDatos from '@/components/tabla/TablaDatos.vue'
import { useConsulta } from '@/composables/useConsulta'
import type { Columna } from '@/interfaces/OpcionInterface'
import type { PropiedadInterface } from '@/interfaces/PropiedadInterface'
import { describirError } from '@/services/http'
import { PropiedadService } from '@/services/PropiedadService'
import { MODALIDADES, TIPOS_PROPIEDAD, TONOS_MODALIDAD } from '@/utils/etiquetas'

const COLUMNAS: Columna[] = [
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'ciudad', titulo: 'Ciudad' },
  { clave: 'tipo', titulo: 'Tipo' },
  { clave: 'modalidad', titulo: 'Modalidad' },
]

const router = useRouter()
const errorAccion = ref('')

const {
  datos: propiedades,
  cargando,
  error,
  cargar,
} = useConsulta(() => PropiedadService.obtenerPropiedades(), [])

function editar(propiedad: PropiedadInterface): void {
  router.push(`/propiedades/${propiedad.id}/editar`)
}

async function eliminar(propiedad: PropiedadInterface): Promise<void> {
  if (!window.confirm(`¿Eliminar "${propiedad.nombre}"? Esta acción no se puede deshacer.`)) return
  errorAccion.value = ''
  try {
    await PropiedadService.eliminarPropiedad(propiedad.id)
    await cargar()
  } catch (problema) {
    errorAccion.value = describirError(problema, 'No se pudo eliminar la propiedad.')
  }
}

onMounted(cargar)
</script>

<template>
  <EncabezadoPagina titulo="Propiedades" descripcion="Tus inmuebles en arriendo.">
    <template #acciones>
      <RouterLink to="/propiedades/nueva" class="boton-primario">
        <Icono nombre="mas" :tamano="18" /> Nueva propiedad
      </RouterLink>
    </template>
  </EncabezadoPagina>

  <AvisoError :mensaje="error || errorAccion" />

  <div class="flex flex-wrap items-start gap-5">
    <section class="tarjeta min-w-0 flex-[3_1_600px] overflow-hidden">
      <TablaDatos
        :columnas="COLUMNAS"
        :filas="propiedades"
        :cargando="cargando"
        mensaje-vacio="Registra tu primera propiedad para empezar."
        @editar="editar"
        @eliminar="eliminar"
      >
        <template #celda-nombre="{ fila }">
          <div class="font-semibold">{{ fila.nombre }}</div>
          <div class="text-[13px] text-apagado">{{ fila.direccion }}</div>
        </template>
        <template #celda-tipo="{ fila }">{{ TIPOS_PROPIEDAD[fila.tipo] }}</template>
        <template #celda-modalidad="{ fila }">
          <InsigniaEstado
            :texto="MODALIDADES[fila.modalidad]"
            :tono="TONOS_MODALIDAD[fila.modalidad]"
          />
        </template>
        <template #vacio>
          <RouterLink to="/propiedades/nueva" class="boton-primario mt-1.5">
            <Icono nombre="mas" :tamano="18" /> Nueva propiedad
          </RouterLink>
        </template>
      </TablaDatos>
    </section>

    <div class="min-w-0 flex-[2_1_380px]">
      <TarjetaGrafico
        titulo="Mapa de propiedades"
        subtitulo="Haz clic en un punto para ver su nombre"
      >
        <MapaPropiedades :propiedades="propiedades" />
      </TarjetaGrafico>
    </div>
  </div>
</template>
