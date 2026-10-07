<script setup lang="ts">
const {
  tamano = 32,
  conTexto = true,
  invertido = false,
} = defineProps<{
  tamano?: number
  conTexto?: boolean
  /** Versión para fondos oscuros: ícono blanco y texto blanco. */
  invertido?: boolean
}>()
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <!-- El ojo de la llave es un aro abierto (el llavero); el punto marca "tu" propiedad. -->
    <svg :width="tamano" :height="tamano" viewBox="0 0 32 32" aria-hidden="true" class="shrink-0">
      <rect width="32" height="32" rx="9" :class="invertido ? 'fill-white' : 'fill-petroleo'" />
      <g
        fill="none"
        stroke-width="2.6"
        stroke-linecap="round"
        :class="invertido ? 'stroke-petroleo' : 'stroke-white'"
      >
        <path d="M10.95 7.36A6 6 0 1 1 7.36 10.95" />
        <path d="M17.3 17.3L25 25M21.4 21.4l2.2-2.2M23.9 23.9l1.9-1.9" />
      </g>
      <circle cx="13" cy="13" r="2" class="fill-menta" />
    </svg>
    <span
      v-if="conTexto"
      class="text-xl font-extrabold tracking-tight"
      :class="invertido ? 'text-white' : 'text-tinta'"
    >
      Key<span :class="invertido ? 'text-white' : 'text-petroleo'">Ring</span>
    </span>
  </span>
</template>
