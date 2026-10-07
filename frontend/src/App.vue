<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PlantillaInterna from '@/components/layout/PlantillaInterna.vue'

const ruta = useRoute()

// Las páginas públicas (inicio, login) se ven sin menú lateral ni barra superior.
const esPaginaPublica = computed(() => ruta.meta.publica === true)
</script>

<template>
  <RouterView v-if="esPaginaPublica" />
  <PlantillaInterna v-else>
    <RouterView />
  </PlantillaInterna>
</template>
