<script setup lang="ts">
import { ICONOS, type NombreIcono } from '@/utils/iconos';

const { nombre, tamano = 20 } = defineProps<{
  nombre: NombreIcono;
  tamano?: number;
}>();
</script>

<template>
  <!-- El contenido sale de utils/iconos.ts (código propio), nunca de datos del usuario. -->
  <svg
    :width="tamano"
    :height="tamano"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0"
    v-html="ICONOS[nombre]"
  />
</template>
