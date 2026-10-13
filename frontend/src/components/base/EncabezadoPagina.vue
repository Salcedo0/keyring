<script setup lang="ts">
defineProps<{
  titulo: string;
  descripcion?: string;
}>();
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl font-bold tracking-tight">{{ titulo }}</h1>
      <p v-if="descripcion" class="text-[15px] text-apagado">{{ descripcion }}</p>
    </div>
    <!-- Botones de la página, por ejemplo "Nueva propiedad". -->
    <slot name="acciones" />
  </div>
</template>
