<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Icono from '@/components/base/Icono.vue'
import LogoKeyRing from '@/components/base/LogoKeyRing.vue'
import { useSesion } from '@/composables/useSesion'
import type { NombreIcono } from '@/utils/iconos'

defineProps<{
  /** Solo íconos (en escritorio). */
  colapsado: boolean
}>()

const emit = defineEmits<{
  alternarColapso: []
  navegar: []
}>()

interface EnlaceMenu {
  ruta: string
  texto: string
  icono: NombreIcono
}

const ENLACES_GENERALES: EnlaceMenu[] = [
  { ruta: '/dashboard', texto: 'Dashboard', icono: 'tablero' },
  { ruta: '/propiedades', texto: 'Propiedades', icono: 'casa' },
  { ruta: '/contratos', texto: 'Contratos', icono: 'documento' },
  { ruta: '/transacciones', texto: 'Transacciones', icono: 'flechas' },
]

const ENLACES_ADMIN: EnlaceMenu[] = [
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'usuarios' },
  { ruta: '/admin/reporte', texto: 'Reporte global', icono: 'tendencia' },
]

const ruta = useRoute()
const { esAdmin } = useSesion()

// La sección de administración solo existe para el rol ADMIN.
const secciones = computed(() => {
  const lista = [{ titulo: 'General', enlaces: ENLACES_GENERALES }]
  if (esAdmin.value) lista.push({ titulo: 'Administración', enlaces: ENLACES_ADMIN })
  return lista
})

/** El enlace queda marcado también en sus páginas hijas (ej. /propiedades/nueva). */
function estaActivo(enlace: EnlaceMenu): boolean {
  return ruta.path.startsWith(enlace.ruta)
}
</script>

<template>
  <aside
    class="flex h-full flex-col gap-7 border-r border-borde bg-white py-5 transition-[width]"
    :class="colapsado ? 'w-[76px] items-center px-3.5' : 'w-64 px-4'"
  >
    <RouterLink
      to="/dashboard"
      class="px-1"
      aria-label="KeyRing, ir al dashboard"
      @click="emit('navegar')"
    >
      <LogoKeyRing v-if="colapsado" variante="icono" :alto="40" />
      <LogoKeyRing v-else :alto="62" />
    </RouterLink>

    <nav aria-label="Navegación principal" class="flex flex-col gap-1">
      <template v-for="seccion in secciones" :key="seccion.titulo">
        <span
          v-if="!colapsado"
          class="px-3 pt-4 pb-2 text-[11px] font-bold tracking-widest text-apagado uppercase first:pt-0"
        >
          {{ seccion.titulo }}
        </span>
        <span v-else class="mx-1.5 my-2 h-px bg-borde first:hidden" aria-hidden="true" />

        <RouterLink
          v-for="enlace in seccion.enlaces"
          :key="enlace.ruta"
          :to="enlace.ruta"
          :title="enlace.texto"
          :aria-label="colapsado ? enlace.texto : undefined"
          :aria-current="estaActivo(enlace) ? 'page' : undefined"
          class="flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition-colors"
          :class="
            estaActivo(enlace)
              ? 'bg-marca-claro font-semibold text-marca'
              : 'font-medium text-tinta-suave hover:bg-fondo'
          "
          @click="emit('navegar')"
        >
          <Icono :nombre="enlace.icono" />
          <span v-if="!colapsado">{{ enlace.texto }}</span>
        </RouterLink>
      </template>
    </nav>

    <!-- Solo en escritorio: en el celular el menú se cierra con la X de la barra superior. -->
    <button
      type="button"
      class="mt-auto hidden h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-apagado hover:bg-fondo lg:flex"
      :aria-label="colapsado ? 'Expandir menú' : 'Colapsar menú'"
      @click="emit('alternarColapso')"
    >
      <Icono :nombre="colapsado ? 'expandir' : 'colapsar'" />
      <span v-if="!colapsado">Colapsar menú</span>
    </button>
  </aside>
</template>
