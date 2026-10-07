<script setup lang="ts">
import { ref } from 'vue'

import BarraSuperior from './BarraSuperior.vue'
import MenuLateral from './MenuLateral.vue'

// En escritorio el menú se puede colapsar a solo íconos.
const menuColapsado = ref(false)
// En el celular el menú vive escondido y se abre encima del contenido.
const menuMovilAbierto = ref(false)
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Escritorio: menú fijo a la izquierda. -->
    <div class="sticky top-0 hidden h-screen lg:block">
      <MenuLateral :colapsado="menuColapsado" @alternar-colapso="menuColapsado = !menuColapsado" />
    </div>

    <!-- Celular: menú como panel lateral con fondo oscuro detrás. -->
    <div v-if="menuMovilAbierto" class="fixed inset-0 z-[1000] flex lg:hidden">
      <MenuLateral :colapsado="false" @navegar="menuMovilAbierto = false" />
      <button
        type="button"
        class="flex-1 bg-tinta/45"
        aria-label="Cerrar menú"
        @click="menuMovilAbierto = false"
      />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <BarraSuperior
        :menu-movil-abierto="menuMovilAbierto"
        @alternar-menu-movil="menuMovilAbierto = !menuMovilAbierto"
      />
      <main class="mx-auto flex w-full max-w-[1360px] flex-col gap-6 p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
