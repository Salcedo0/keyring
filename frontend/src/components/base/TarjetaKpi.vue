<script setup lang="ts">
defineProps<{
  etiqueta: string
  /** Valor ya formateado, por ejemplo "$ 86.420.000". */
  valor: string
  nota?: string
  /** Fondo petróleo para el indicador principal. */
  destacada?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-1 basis-56 flex-col gap-2.5 rounded-2xl p-5"
    :class="destacada ? 'bg-tinta text-white shadow-lg shadow-tinta/20' : 'tarjeta shadow-sm'"
  >
    <span class="text-sm font-semibold" :class="destacada ? 'text-borde' : 'text-apagado'">
      {{ etiqueta }}
    </span>
    <span class="text-3xl font-extrabold tracking-tight tabular-nums">{{ valor }}</span>
    <span v-if="nota" class="text-[13px]" :class="destacada ? 'text-borde' : 'text-apagado'">
      {{ nota }}
    </span>
  </div>
</template>
