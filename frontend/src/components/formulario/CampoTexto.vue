<script setup lang="ts" generic="T extends string | number | null">
import MensajeCampo from './MensajeCampo.vue'

const valor = defineModel<T>({ required: true })

const { tipo = 'text' } = defineProps<{
  etiqueta: string
  tipo?: 'text' | 'email' | 'password' | 'number' | 'date' | 'month' | 'tel'
  placeholder?: string
  error?: string
  ayuda?: string
  obligatorio?: boolean
  /** Muestra un área de texto de varias líneas en vez de un campo de una línea. */
  multilinea?: boolean
}>()
</script>

<template>
  <label class="etiqueta flex flex-col gap-2">
    <span>{{ etiqueta }}<span v-if="obligatorio" aria-hidden="true"> *</span></span>
    <textarea
      v-if="multilinea"
      v-model="valor"
      rows="3"
      :placeholder="placeholder"
      class="campo h-auto py-3 font-normal"
      :class="{ 'campo-con-error': error }"
    />
    <input
      v-else
      v-model="valor"
      :type="tipo"
      :placeholder="placeholder"
      :required="obligatorio"
      :aria-invalid="Boolean(error)"
      class="campo font-normal"
      :class="{ 'campo-con-error': error }"
    />
    <MensajeCampo :error="error" :ayuda="ayuda" />
  </label>
</template>
