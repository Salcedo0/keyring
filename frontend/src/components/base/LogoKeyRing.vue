<script setup lang="ts">
import { computed } from 'vue'

import iconoClaro from '@/assets/img/keyring-icono-claro.png'
import icono from '@/assets/img/keyring-icono.png'
import logoClaro from '@/assets/img/keyring-logo-claro.png'
import logo from '@/assets/img/keyring-logo.png'

const {
  variante = 'completo',
  alto = 40,
  claro = false,
} = defineProps<{
  /** 'completo': llave, casa, nombre y lema. 'icono': solo la llave y la casa. */
  variante?: 'completo' | 'icono'
  /** Alto en píxeles; el ancho se ajusta solo. */
  alto?: number
  /** Versión para fondos oscuros: la casa y el nombre pasan a color crema. */
  claro?: boolean
}>()

const imagen = computed(() => {
  if (variante === 'icono') return claro ? iconoClaro : icono
  return claro ? logoClaro : logo
})
</script>

<template>
  <img
    :src="imagen"
    :style="{ height: `${alto}px` }"
    class="w-auto shrink-0 select-none"
    alt="KeyRing, propiedades en equilibrio"
    draggable="false"
  />
</template>
