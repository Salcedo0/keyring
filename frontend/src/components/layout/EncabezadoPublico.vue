<script setup lang="ts">
import LogoKeyRing from '@/components/base/LogoKeyRing.vue'
</script>

<template>
  <header class="border-b border-borde bg-white">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
      <RouterLink to="/" aria-label="KeyRing, inicio">
        <LogoKeyRing />
      </RouterLink>
      <nav aria-label="Principal" class="flex flex-wrap items-center gap-1">
        <a href="#beneficios" class="px-3.5 py-3 text-[15px] font-medium text-tinta-suave">
          Beneficios
        </a>
        <a href="#como-funciona" class="px-3.5 py-3 text-[15px] font-medium text-tinta-suave">
          Cómo funciona
        </a>
        <RouterLink to="/ingresar" class="boton-primario ml-2">Iniciar sesión</RouterLink>
      </nav>
    </div>
  </header>
</template>
