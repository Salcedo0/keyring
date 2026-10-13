<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

import Icono from '@/components/base/Icono.vue';
import LogoKeyRing from '@/components/base/LogoKeyRing.vue';
import EncabezadoPublico from '@/components/layout/EncabezadoPublico.vue';
import { useDesplazamientoSuave } from '@/composables/useDesplazamientoSuave';
import type { NombreIcono } from '@/utils/iconos';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Beneficio {
  icono: NombreIcono;
  titulo: string;
  texto: string;
  clasesIcono: string;
}

const BENEFICIOS: Beneficio[] = [
  {
    icono: 'casa',
    titulo: 'Todas tus propiedades en un lugar',
    texto:
      'Registra apartamentos, casas y locales con su ciudad, tipo y modalidad: corta estancia, contrato fijo o ambas. Ubícalas en el mapa.',
    clasesIcono: 'bg-marca-claro text-marca',
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
];

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
];

const DURACION_CIRCULO = 0.9;

useDesplazamientoSuave();

const raiz = useTemplateRef<HTMLElement>('raiz');
let animaciones: ReturnType<typeof gsap.matchMedia> | null = null;

/** Elementos de esta vista marcados con data-animar="nombre". */
function elementos(nombre: string): HTMLElement[] {
  return Array.from(raiz.value?.querySelectorAll<HTMLElement>(`[data-animar="${nombre}"]`) ?? []);
}

// Las animaciones de scroll corren una sola vez: si se repitieran al subir y bajar, distraerían.
function alEntrar(nombre: string): ScrollTrigger.Vars {
  return { trigger: elementos(nombre), start: 'top 80%', once: true };
}

function animarEntrada(): void {
  const titulo = SplitText.create(elementos('titulo'), { type: 'words' });
  const circulo = elementos('circulo');

  gsap
    .timeline({ defaults: { duration: 0.6, ease: 'power3.out' } })
    .from(elementos('antetitulo'), { autoAlpha: 0, y: 12 })
    .from(titulo.words, { autoAlpha: 0, y: 24, stagger: 0.03 }, 0.15)
    .from(elementos('parrafo'), { autoAlpha: 0, y: 12 }, '-=0.4')
    .from(elementos('botones'), { autoAlpha: 0, y: 12 }, '-=0.4')
    .from(circulo, { autoAlpha: 0, scale: 0.9, duration: DURACION_CIRCULO }, 0);

  gsap.to(circulo, {
    y: -8,
    duration: 2.4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: DURACION_CIRCULO,
  });
}

function animarParallax(): void {
  gsap.to(elementos('contenedor-circulo'), {
    y: 90,
    ease: 'none',
    scrollTrigger: { trigger: elementos('hero'), start: 'top top', end: 'bottom top', scrub: true },
  });
}

function animarBeneficios(): void {
  gsap
    .timeline({
      defaults: { duration: 0.7, ease: 'power3.out' },
      scrollTrigger: alEntrar('beneficios'),
    })
    .from(elementos('beneficios-titulo'), { autoAlpha: 0, y: 20 })
    .from(elementos('beneficio'), { autoAlpha: 0, y: 30, stagger: 0.12 }, '-=0.4');
}

function animarPasos(): void {
  gsap
    .timeline({ defaults: { duration: 0.6, ease: 'power3.out' }, scrollTrigger: alEntrar('pasos') })
    .from(elementos('paso-numero'), {
      autoAlpha: 0,
      scale: 0.5,
      ease: 'back.out(1.7)',
      stagger: 0.15,
    })
    .from(elementos('paso-texto'), { autoAlpha: 0, y: 12, stagger: 0.15 }, 0.15);

  gsap.from(elementos('llamado'), {
    autoAlpha: 0,
    scale: 0.96,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: alEntrar('llamado'),
  });
}

function animarConMovimiento(): void {
  animarEntrada();
  animarBeneficios();
  animarPasos();
}

// Con movimiento reducido no se anima nada: la página se ve completa tal como está en el HTML.
function sinAnimaciones(): void {}

onMounted(() => {
  const alcance = raiz.value ?? undefined;
  animaciones = gsap.matchMedia();
  animaciones.add('(prefers-reduced-motion: no-preference)', animarConMovimiento, alcance);
  animaciones.add(
    '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
    animarParallax,
    alcance,
  );
  animaciones.add('(prefers-reduced-motion: reduce)', sinAnimaciones, alcance);
});

// revert() borra los tweens, los ScrollTrigger y el SplitText para que no queden vivos al salir.
onBeforeUnmount(() => {
  animaciones?.revert();
  animaciones = null;
});
</script>

<template>
  <div ref="raiz" class="min-h-screen">
    <EncabezadoPublico />

    <section
      data-animar="hero"
      class="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-6 pt-20 pb-20"
    >
      <div class="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
        <span
          data-animar="antetitulo"
          class="text-[13px] font-semibold tracking-[0.3em] text-apagado uppercase"
        >
          Propiedades en equilibrio
        </span>
        <h1
          data-animar="titulo"
          class="max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl"
        >
          Todos tus arriendos en un solo <span class="text-marca">llavero</span>.
        </h1>
        <p data-animar="parrafo" class="max-w-xl text-lg leading-relaxed text-tinta-suave">
          KeyRing reúne tus propiedades de corta estancia y contrato fijo, sus contratos, ingresos y
          gastos en un tablero claro. Sabe cuánto deja cada inmueble, mes a mes, en pesos
          colombianos.
        </p>
        <div data-animar="botones" class="flex flex-wrap gap-3 pt-2">
          <RouterLink to="/ingresar" class="boton-primario h-13 px-7 text-base">
            Iniciar sesión
            <Icono nombre="flechaDerecha" :tamano="18" />
          </RouterLink>
          <a href="#como-funciona" class="boton-secundario h-13 px-6 text-base">
            Ver cómo funciona
          </a>
        </div>
      </div>
      <div data-animar="contenedor-circulo" class="flex flex-[1_1_320px] justify-center">
        <span
          data-animar="circulo"
          class="flex h-80 w-80 items-center justify-center rounded-full bg-white shadow-xl shadow-tinta/10"
        >
          <LogoKeyRing variante="icono" :alto="220" />
        </span>
      </div>
    </section>

    <section id="beneficios" data-animar="beneficios" class="border-y border-borde bg-white">
      <div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20">
        <div data-animar="beneficios-titulo" class="flex max-w-2xl flex-col gap-2.5">
          <span class="text-[13px] font-bold tracking-widest text-marca uppercase">
            Beneficios
          </span>
          <h2 class="text-4xl font-bold tracking-tight">
            Menos hojas de cálculo, más claridad sobre tu negocio.
          </h2>
        </div>
        <div class="flex flex-wrap gap-5">
          <article
            v-for="beneficio in BENEFICIOS"
            :key="beneficio.titulo"
            data-animar="beneficio"
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
      <h2 class="text-3xl font-bold tracking-tight">Cómo funciona</h2>
      <ol data-animar="pasos" class="flex flex-wrap gap-5">
        <li
          v-for="(paso, indice) in PASOS"
          :key="paso.titulo"
          class="flex flex-1 basis-64 items-start gap-4"
        >
          <span
            data-animar="paso-numero"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marca font-bold text-white"
          >
            {{ indice + 1 }}
          </span>
          <div data-animar="paso-texto">
            <div class="text-[17px] font-bold">{{ paso.titulo }}</div>
            <p class="mt-1.5 text-[15px] text-tinta-suave">{{ paso.texto }}</p>
          </div>
        </li>
      </ol>
      <div
        data-animar="llamado"
        class="mt-4 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-marca p-10 text-white"
      >
        <div class="flex flex-col gap-2">
          <div class="font-titulo text-2xl font-bold">¿Listo para ver tus números?</div>
          <div class="text-white/90">
            Entra con tu cuenta y empieza por registrar tu primera propiedad.
          </div>
        </div>
        <RouterLink to="/ingresar" class="boton-secundario h-13 border-0 px-7 text-base text-marca">
          Iniciar sesión
        </RouterLink>
      </div>
    </section>

    <footer class="border-t border-borde bg-white">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-apagado"
      >
        <span class="flex items-center gap-2">
          <LogoKeyRing variante="icono" :alto="26" />
          © KeyRing
        </span>
        <span>Hecho para propietarios en Colombia · Valores en COP</span>
      </div>
    </footer>
  </div>
</template>
