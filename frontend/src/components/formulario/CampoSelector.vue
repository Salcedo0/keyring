<script setup lang="ts" generic="T">
import type { Opcion } from '@/interfaces/OpcionInterface'

import MensajeCampo from './MensajeCampo.vue'

const valor = defineModel<T>({ required: true })

defineProps<{
  etiqueta: string
  opciones: Opcion<T>[]
  /** Texto de la primera opción cuando todavía no se ha elegido nada. */
  textoVacio?: string
  error?: string
  ayuda?: string
  obligatorio?: boolean
}>()
</script>

<template>
  <label class="etiqueta flex flex-col gap-2">
    <span>{{ etiqueta }}<span v-if="obligatorio" aria-hidden="true"> *</span></span>
    <span class="relative block">
      <select
        v-model="valor"
        :aria-invalid="Boolean(error)"
        class="campo cursor-pointer appearance-none pr-10 font-normal"
        :class="{ 'campo-con-error': error }"
      >
        <option v-if="textoVacio" :value="null" disabled>{{ textoVacio }}</option>
        <option v-for="opcion in opciones" :key="String(opcion.valor)" :value="opcion.valor">
          {{ opcion.texto }}
        </option>
      </select>
      <svg
        class="pointer-events-none absolute top-3.5 right-3.5 text-apagado"
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
    <MensajeCampo :error="error" :ayuda="ayuda" />
  </label>
</template>
