<script setup lang="ts">
import Icono from '@/components/base/Icono.vue'
import LogoKeyRing from '@/components/base/LogoKeyRing.vue'
import EncabezadoPublico from '@/components/layout/EncabezadoPublico.vue'
import type { NombreIcono } from '@/utils/iconos'

interface Beneficio {
  icono: NombreIcono
  titulo: string
  texto: string
  clasesIcono: string
}

const BENEFICIOS: Beneficio[] = [
  {
    icono: 'casa',
    titulo: 'Todas tus propiedades en un lugar',
    texto:
      'Registra apartamentos, casas y locales con su ciudad, tipo y modalidad: corta estancia, contrato fijo o ambas. Ubícalas en el mapa.',
    clasesIcono: 'bg-petroleo-claro text-petroleo',
  },
  {
    icono: 'tendencia',
    titulo: 'Ingresos y gastos claros',
    texto:
      'Cada reserva, canon, comisión o reparación queda en su categoría. Mira tu utilidad neta por propiedad y por mes, sin cuentas a mano.',
    clasesIcono: 'bg-ingreso-claro text-ingreso',
  },
  {
    icono: 'documento',
    titulo: 'Contratos bajo control',
    texto:
      'Guarda los datos de cada inquilino, las fechas y el valor. El estado de cada contrato se ve de un vistazo.',
    clasesIcono: 'bg-ambar-claro text-ambar',
  },
]

const PASOS = [
  {
    titulo: 'Registra tus propiedades',
    texto: 'Nombre, dirección, ciudad y ubicación en el mapa.',
  },
  {
    titulo: 'Agrega contratos y movimientos',
    texto: 'Reservas, cánones, servicios, administración y más.',
  },
  { titulo: 'Mira el desempeño', texto: 'Indicadores, gráficos y filtros por propiedad y fecha.' },
]
</script>

<template>
  <div class="min-h-screen">
    <EncabezadoPublico />

    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-6 pt-24 pb-20">
      <span
        class="self-start rounded-full bg-petroleo-claro px-3 py-1.5 text-[13px] font-semibold text-petroleo"
      >
        Corta estancia y contrato fijo
      </span>
      <h1 class="max-w-3xl text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
        Todos tus arriendos en un solo llavero.
      </h1>
      <p class="max-w-xl text-lg leading-relaxed text-tinta-suave">
        KeyRing reúne tus propiedades, contratos, ingresos y gastos en un tablero financiero claro.
        Sabe cuánto deja cada inmueble, mes a mes, en pesos colombianos.
      </p>
      <div class="flex flex-wrap gap-3 pt-2">
        <RouterLink to="/ingresar" class="boton-primario h-13 px-7 text-base">
          Iniciar sesión
          <Icono nombre="flechaDerecha" :tamano="18" />
        </RouterLink>
        <a href="#como-funciona" class="boton-secundario h-13 px-6 text-base">Ver cómo funciona</a>
      </div>
    </section>

    <section id="beneficios" class="border-y border-borde bg-white">
      <div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20">
        <div class="flex max-w-2xl flex-col gap-2.5">
          <span class="text-[13px] font-bold tracking-widest text-petroleo uppercase">
            Beneficios
          </span>
          <h2 class="text-4xl font-extrabold tracking-tight">
            Menos hojas de cálculo, más claridad sobre tu negocio.
          </h2>
        </div>
        <div class="flex flex-wrap gap-5">
          <article
            v-for="beneficio in BENEFICIOS"
            :key="beneficio.titulo"
            class="tarjeta flex flex-1 basis-72 flex-col gap-3.5 p-7"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-xl"
              :class="beneficio.clasesIcono"
            >
              <Icono :nombre="beneficio.icono" :tamano="24" />
            </span>
            <h3 class="text-xl font-bold">{{ beneficio.titulo }}</h3>
            <p class="text-[15px] leading-relaxed text-tinta-suave">{{ beneficio.texto }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="como-funciona" class="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-20">
      <h2 class="text-3xl font-extrabold tracking-tight">Cómo funciona</h2>
      <ol class="flex flex-wrap gap-5">
        <li
          v-for="(paso, indice) in PASOS"
          :key="paso.titulo"
          class="flex flex-1 basis-64 items-start gap-4"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-petroleo font-bold text-white"
          >
            {{ indice + 1 }}
          </span>
          <div>
            <div class="text-[17px] font-bold">{{ paso.titulo }}</div>
            <p class="mt-1.5 text-[15px] text-tinta-suave">{{ paso.texto }}</p>
          </div>
        </li>
      </ol>
      <div
        class="mt-4 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-petroleo p-10 text-white"
      >
        <div class="flex flex-col gap-2">
          <div class="text-2xl font-extrabold">¿Listo para ver tus números?</div>
          <div class="text-petroleo-claro">
            Entra con tu cuenta y empieza por registrar tu primera propiedad.
          </div>
        </div>
        <RouterLink
          to="/ingresar"
          class="boton-secundario h-13 border-0 px-7 text-base text-petroleo"
        >
          Iniciar sesión
        </RouterLink>
      </div>
    </section>

    <footer class="border-t border-borde bg-white">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-apagado"
      >
        <span class="flex items-center gap-2">
          <LogoKeyRing :tamano="22" :con-texto="false" />
          © KeyRing
        </span>
        <span>Hecho para propietarios en Colombia · Valores en COP</span>
      </div>
    </footer>
  </div>
</template>
