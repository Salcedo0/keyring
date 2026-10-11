<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Icono from '@/components/base/Icono.vue'
import InsigniaEstado from '@/components/base/InsigniaEstado.vue'
import { useSesion } from '@/composables/useSesion'

defineProps<{
  menuMovilAbierto: boolean
}>()

const emit = defineEmits<{
  alternarMenuMovil: []
}>()

const ruta = useRoute()
const router = useRouter()
const { usuario, cerrarSesion } = useSesion()

const titulo = computed(() => ruta.meta.titulo ?? '')

/** Primeras letras del nombre y apellido: "Daniel Mejía" → "DM". */
const iniciales = computed(() => {
  const palabras = (usuario.value?.nombre ?? '').split(' ').filter(Boolean)
  return palabras
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase()
})

function salir(): void {
  cerrarSesion()
  router.push('/ingresar')
}
</script>

<template>
  <header
    class="flex min-h-17 flex-wrap items-center justify-between gap-3 border-b border-borde bg-white px-4 py-3 lg:px-8"
  >
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="boton-icono border-0 lg:hidden"
        :aria-label="menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'"
        @click="emit('alternarMenuMovil')"
      >
        <Icono :nombre="menuMovilAbierto ? 'cerrar' : 'menu'" :tamano="22" />
      </button>
      <span class="text-sm font-semibold">{{ titulo }}</span>
    </div>

    <div v-if="usuario" class="flex flex-wrap items-center gap-3.5">
      <span class="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          class="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-marca-claro text-sm font-bold text-marca"
        >
          {{ iniciales }}
        </span>
        <span class="hidden flex-col items-start gap-0.5 sm:flex">
          <strong class="text-sm font-semibold">{{ usuario.nombre }}</strong>
          <InsigniaEstado :texto="usuario.rol" :tono="usuario.rol === 'ADMIN' ? 'marca' : 'gris'" />
        </span>
      </span>
      <button type="button" class="boton-secundario px-3.5" @click="salir">
        <Icono nombre="salir" :tamano="18" />
        <span class="hidden sm:inline">Cerrar sesión</span>
      </button>
    </div>
  </header>
</template>
