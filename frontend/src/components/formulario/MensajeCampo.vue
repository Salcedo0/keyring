<script setup lang="ts">
import Icono from '@/components/base/Icono.vue'

defineProps<{
  error?: string
  ayuda?: string
}>()
</script>

<template>
  <!-- Debajo de cada campo: el error si lo hay; si no, el texto de ayuda. -->
  <span v-if="error" class="flex items-center gap-1.5 text-[13px] font-medium text-gasto">
    <Icono nombre="alerta" :tamano="14" />
    {{ error }}
  </span>
  <span v-else-if="ayuda" class="text-[13px] font-normal text-apagado">{{ ayuda }}</span>
</template>
