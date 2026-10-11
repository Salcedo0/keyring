<script setup lang="ts">
import type { Tono } from '@/utils/etiquetas'

defineProps<{
  texto: string
  tono: Tono
}>()

const CLASES_POR_TONO: Record<Tono, string> = {
  verde: 'bg-ingreso-claro text-ingreso',
  ambar: 'bg-ambar-claro text-ambar',
  gris: 'bg-fondo text-tinta-suave',
  rojo: 'bg-gasto-claro text-gasto',
  marca: 'bg-marca-claro text-marca',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap"
    :class="CLASES_POR_TONO[tono]"
  >
    {{ texto }}
  </span>
</template>
