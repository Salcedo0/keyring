<script setup lang="ts">
import EstadoVacio from './EstadoVacio.vue'

const { hayDatos = true } = defineProps<{
  titulo: string
  subtitulo?: string
  /** Si es falso, en vez del gráfico se muestra el estado vacío. */
  hayDatos?: boolean
}>()
</script>

<template>
  <figure class="tarjeta m-0 flex min-w-0 flex-col gap-4 p-5">
    <figcaption class="flex flex-col gap-0.5">
      <span class="text-[17px] font-bold">{{ titulo }}</span>
      <span v-if="subtitulo" class="text-[13px] text-apagado">{{ subtitulo }}</span>
    </figcaption>
    <slot v-if="hayDatos" />
    <EstadoVacio v-else mensaje="Sin datos para mostrar con estos filtros." />
  </figure>
</template>
