<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

import MensajeCampo from '@/components/formulario/MensajeCampo.vue'
import { COLORES } from '@/utils/paleta'

const latitud = defineModel<number | null>('latitud', { required: true })
const longitud = defineModel<number | null>('longitud', { required: true })

defineProps<{
  error?: string
}>()

// Si la propiedad todavía no tiene ubicación, el mapa arranca en Medellín.
const CENTRO_INICIAL: L.LatLngExpression = [6.2442, -75.5812]

const contenedor = useTemplateRef<HTMLDivElement>('contenedor')
let mapa: L.Map | null = null
let marcador: L.CircleMarker | null = null

/** Pone (o mueve) el punto del mapa en la ubicación elegida. */
function dibujarMarcador(): void {
  if (!mapa || latitud.value === null || longitud.value === null) return
  const punto: L.LatLngExpression = [latitud.value, longitud.value]
  if (marcador) {
    marcador.setLatLng(punto)
    return
  }
  marcador = L.circleMarker(punto, {
    radius: 10,
    color: '#FFFFFF',
    weight: 3,
    fillColor: COLORES.petroleo,
    fillOpacity: 1,
  }).addTo(mapa)
}

/** Guarda el punto donde se hizo clic, redondeado a 6 decimales (unos 10 cm). */
function elegirUbicacion(evento: L.LeafletMouseEvent): void {
  latitud.value = Number(evento.latlng.lat.toFixed(6))
  longitud.value = Number(evento.latlng.lng.toFixed(6))
}

onMounted(() => {
  if (!contenedor.value) return
  const tieneUbicacion = latitud.value !== null && longitud.value !== null
  const centro: L.LatLngExpression = tieneUbicacion
    ? [latitud.value!, longitud.value!]
    : CENTRO_INICIAL

  mapa = L.map(contenedor.value).setView(centro, 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(mapa)
  mapa.on('click', elegirUbicacion)
  dibujarMarcador()
})

// Cuando el formulario carga una propiedad existente, la ubicación llega después de montar.
watch([latitud, longitud], () => {
  dibujarMarcador()
  if (mapa && latitud.value !== null && longitud.value !== null) {
    mapa.panTo([latitud.value, longitud.value])
  }
})

onBeforeUnmount(() => mapa?.remove())
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-baseline justify-between gap-2">
      <span class="etiqueta">Ubicación en el mapa *</span>
      <span class="text-[13px] text-apagado">Haz clic en el mapa para marcarla</span>
    </div>
    <div
      ref="contenedor"
      class="h-80 w-full overflow-hidden rounded-xl border"
      :class="error ? 'border-gasto' : 'border-borde-fuerte'"
      aria-label="Mapa para elegir la ubicación"
    />
    <p class="text-[13px] text-apagado tabular-nums">
      <template v-if="latitud !== null && longitud !== null">
        Latitud {{ latitud }} · Longitud {{ longitud }}
      </template>
      <template v-else>Todavía no has marcado la ubicación.</template>
    </p>
    <MensajeCampo :error="error" />
  </div>
</template>
