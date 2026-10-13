<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AvisoError from '@/components/base/AvisoError.vue';
import Icono from '@/components/base/Icono.vue';
import LogoKeyRing from '@/components/base/LogoKeyRing.vue';
import CampoTexto from '@/components/formulario/CampoTexto.vue';
import { useSesion } from '@/composables/useSesion';
import { describirError } from '@/services/http';
import { esCorreoValido, estaVacio, hayErrores } from '@/utils/validaciones';

const ruta = useRoute();
const router = useRouter();
const { iniciarSesion } = useSesion();

const formulario = reactive({ correo: '', contrasena: '' });
const errores = reactive({ correo: '', contrasena: '' });
const errorGeneral = ref('');
const enviando = ref(false);

function validar(): boolean {
  errores.correo = esCorreoValido(formulario.correo) ? '' : 'Ingresa un correo válido';
  errores.contrasena = estaVacio(formulario.contrasena) ? 'Ingresa tu contraseña' : '';
  return !hayErrores(errores);
}

/**
 * Si el usuario venía de una página protegida, vuelve a ella; si no, va al dashboard.
 * Solo se aceptan rutas internas ('/contratos'), nunca direcciones de otros sitios.
 */
function rutaDeRegreso(): string {
  const volver = ruta.query.volver;
  const esRutaInterna =
    typeof volver === 'string' && volver.startsWith('/') && !volver.startsWith('//');
  return esRutaInterna ? volver : '/dashboard';
}

async function ingresar(): Promise<void> {
  errorGeneral.value = '';
  if (!validar()) return;

  enviando.value = true;
  try {
    await iniciarSesion(formulario);
    router.push(rutaDeRegreso());
  } catch (error) {
    errorGeneral.value = describirError(error, 'No pudimos iniciar sesión.');
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-wrap">
    <aside
      class="relative flex flex-1 basis-[420px] flex-col justify-between gap-12 overflow-hidden bg-tinta p-12 text-white"
    >
      <RouterLink to="/" aria-label="KeyRing, volver al inicio" class="relative self-start">
        <LogoKeyRing claro :alto="72" />
      </RouterLink>
      <div class="relative flex max-w-md flex-col gap-4">
        <h1 class="text-4xl leading-tight font-bold tracking-tight">Bienvenido de nuevo.</h1>
        <p class="text-[17px] leading-relaxed text-borde">
          Tus propiedades, contratos y movimientos te esperan donde los dejaste.
        </p>
      </div>
      <span class="relative text-[13px] text-borde">© KeyRing · Propiedades en equilibrio</span>
    </aside>

    <main class="flex flex-[999_1_560px] items-center justify-center px-6 py-12">
      <form class="flex w-full max-w-md flex-col gap-5" novalidate @submit.prevent="ingresar">
        <div class="flex flex-col gap-2">
          <h2 class="text-3xl font-bold tracking-tight">Iniciar sesión</h2>
          <p class="text-[15px] text-apagado">Ingresa con el correo de tu cuenta.</p>
        </div>

        <AvisoError :mensaje="errorGeneral" />

        <CampoTexto
          v-model="formulario.correo"
          etiqueta="Correo electrónico"
          tipo="email"
          :error="errores.correo"
        />
        <CampoTexto
          v-model="formulario.contrasena"
          etiqueta="Contraseña"
          tipo="password"
          :error="errores.contrasena"
        />

        <button type="submit" class="boton-primario h-12 text-base" :disabled="enviando">
          {{ enviando ? 'Ingresando…' : 'Iniciar sesión' }}
        </button>

        <p class="text-center text-sm text-apagado">
          ¿No tienes cuenta?
          <RouterLink to="/registrarse" class="font-semibold text-marca">Crea una aquí</RouterLink>
        </p>

        <RouterLink
          to="/"
          class="flex items-center justify-center gap-1.5 p-3 text-sm font-semibold text-apagado"
        >
          <Icono nombre="flechaIzquierda" :tamano="16" />
          Volver al inicio
        </RouterLink>
      </form>
    </main>
  </div>
</template>
