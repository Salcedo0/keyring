<script setup lang="ts" generic="T">
import type { Opcion } from '@/interfaces/OpcionInterface'

const valor = defineModel<T>({ required: true })

defineProps<{
  etiqueta: string
  opciones: Opcion<T>[]
}>()
</script>

<template>
  <!-- Selector compacto para las barras de filtros: etiqueta pequeña arriba, sin errores. -->
  <label
    class="flex min-w-48 flex-1 flex-col gap-1.5 text-xs font-semibold tracking-wide text-apagado"
  >
    {{ etiqueta }}
    <span class="relative block">
      <select
        v-model="valor"
        class="campo cursor-pointer appearance-none pr-10 text-sm font-medium tracking-normal"
      >
        <option v-for="opcion in opciones" :key="String(opcion.valor)" :value="opcion.valor">
          {{ opcion.texto }}
        </option>
      </select>
      <svg
        class="pointer-events-none absolute top-3.5 right-3.5"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  </label>
</template>
