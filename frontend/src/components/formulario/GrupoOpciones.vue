<script setup lang="ts" generic="T extends string">
import type { Opcion } from '@/interfaces/OpcionInterface'

import MensajeCampo from './MensajeCampo.vue'

const valor = defineModel<T | null>({ required: true })

defineProps<{
  etiqueta: string
  opciones: Opcion<T>[]
  error?: string
  obligatorio?: boolean
}>()
</script>

<template>
  <!-- Botones de opción única: modalidad, tipo de contrato, ingreso o gasto. -->
  <fieldset class="m-0 flex flex-col gap-2 border-0 p-0">
    <legend class="etiqueta mb-2 p-0">
      {{ etiqueta }}<span v-if="obligatorio" aria-hidden="true"> *</span>
    </legend>
    <div class="flex flex-wrap gap-2.5">
      <label
        v-for="opcion in opciones"
        :key="opcion.valor"
        class="flex h-11 min-w-36 flex-1 cursor-pointer items-center gap-2.5 rounded-xl border px-4 text-sm font-semibold transition-colors"
        :class="
          valor === opcion.valor
            ? 'border-petroleo bg-petroleo-claro text-petroleo'
            : 'border-borde-fuerte bg-white text-tinta-suave hover:bg-fondo'
        "
      >
        <input v-model="valor" type="radio" :value="opcion.valor" class="accent-petroleo" />
        {{ opcion.texto }}
      </label>
    </div>
    <MensajeCampo :error="error" />
  </fieldset>
</template>
