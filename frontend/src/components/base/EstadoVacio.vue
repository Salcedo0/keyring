<script setup lang="ts">
import Icono from './Icono.vue'

const { titulo = 'No hay datos todavía' } = defineProps<{
  titulo?: string
  mensaje?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-fondo text-apagado">
      <Icono nombre="bandeja" :tamano="26" />
    </span>
    <strong class="text-base">{{ titulo }}</strong>
    <span v-if="mensaje" class="max-w-xs text-sm text-apagado">{{ mensaje }}</span>
    <!-- Botón opcional, por ejemplo "Nueva propiedad". -->
    <slot />
  </div>
</template>
