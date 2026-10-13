<script setup lang="ts">
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';

import type { PropiedadInterface } from '@/interfaces/PropiedadInterface';
import { COLORES } from '@/utils/paleta';

const props = defineProps<{
  propiedades: PropiedadInterface[];
}>();

// Centro de Colombia: es lo que se ve mientras no haya propiedades con ubicación.
const CENTRO_COLOMBIA: L.LatLngExpression = [4.6, -74.1];

const contenedor = useTemplateRef<HTMLDivElement>('contenedor');
let mapa: L.Map | null = null;
const marcadores = L.layerGroup();

/** Texto de la ventanita del punto. Se arma como texto (no HTML) porque el nombre lo escribe un usuario. */
function contenidoVentana(propiedad: PropiedadInterface): HTMLElement {
  const elemento = document.createElement('span');
  elemento.textContent = `${propiedad.nombre} · ${propiedad.ciudad}`;
  return elemento;
}

/** Borra los puntos del mapa y vuelve a dibujar uno por cada propiedad con ubicación. */
function dibujarPropiedades(): void {
  if (!mapa) return;
  marcadores.clearLayers();

  const conUbicacion = props.propiedades.filter((p) => p.latitud !== null && p.longitud !== null);
  for (const propiedad of conUbicacion) {
    L.circleMarker([propiedad.latitud!, propiedad.longitud!], {
      radius: 9,
      color: '#FFFFFF',
      weight: 2.5,
      fillColor: COLORES.marca,
      fillOpacity: 1,
    })
      .bindPopup(contenidoVentana(propiedad))
      .addTo(marcadores);
  }

  if (conUbicacion.length > 0) {
    mapa.fitBounds(L.latLngBounds(conUbicacion.map((p) => [p.latitud!, p.longitud!])), {
      padding: [40, 40],
      maxZoom: 13,
    });
  }
}

onMounted(() => {
  if (!contenedor.value) return;
  mapa = L.map(contenedor.value).setView(CENTRO_COLOMBIA, 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(mapa);
  marcadores.addTo(mapa);
  dibujarPropiedades();
});

watch(() => props.propiedades, dibujarPropiedades);

onBeforeUnmount(() => mapa?.remove());
</script>

<template>
  <div
    ref="contenedor"
    class="h-96 w-full overflow-hidden rounded-xl"
    aria-label="Mapa de propiedades"
  />
</template>
