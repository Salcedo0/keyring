<script setup lang="ts">
import LogoKeyRing from '@/components/base/LogoKeyRing.vue';
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
    <LogoKeyRing variante="icono" :alto="96" />
    <h1 class="text-3xl font-bold tracking-tight">Esta página no existe</h1>
    <p class="text-apagado">Revisa la dirección o vuelve al inicio.</p>
    <RouterLink to="/" class="boton-primario">Volver al inicio</RouterLink>
  </main>
</template>
