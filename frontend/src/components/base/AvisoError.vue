<script setup lang="ts">
import Icono from './Icono.vue'

defineProps<{
  /** Si está vacío, el aviso no se muestra. */
  mensaje: string
}>()
</script>

<template>
  <div
    v-if="mensaje"
    role="alert"
    class="flex items-start gap-3 rounded-xl border border-gasto/25 bg-gasto-claro px-4 py-3.5 text-sm text-gasto"
  >
    <Icono nombre="alerta" class="mt-px" />
    <span>{{ mensaje }}</span>
  </div>
</template>
