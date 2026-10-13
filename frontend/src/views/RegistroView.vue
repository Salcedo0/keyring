<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import AvisoError from '@/components/base/AvisoError.vue';
import Icono from '@/components/base/Icono.vue';
import LogoKeyRing from '@/components/base/LogoKeyRing.vue';
import CampoTexto from '@/components/formulario/CampoTexto.vue';
import { useSesion } from '@/composables/useSesion';
import { describirError } from '@/services/http';
import { esCorreoValido, hayErrores } from '@/utils/validaciones';

// Debe coincidir con el mínimo que exige el back (RegistrarseDto).
const LARGO_MINIMO_CONTRASENA = 8;

const router = useRouter();
const { crearCuenta } = useSesion();

const formulario = reactive({ nombre: '', correo: '', contrasena: '', confirmacion: '' });
const errores = reactive({ nombre: '', correo: '', contrasena: '', confirmacion: '' });
const errorGeneral = ref('');
const enviando = ref(false);

function validar(): boolean {
  errores.nombre = formulario.nombre.trim().length >= 2 ? '' : 'Escribe tu nombre completo';
  errores.correo = esCorreoValido(formulario.correo) ? '' : 'Ingresa un correo válido';
  errores.contrasena =
    formulario.contrasena.length >= LARGO_MINIMO_CONTRASENA
      ? ''
      : `La contraseña debe tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres`;
  errores.confirmacion =
    formulario.confirmacion === formulario.contrasena ? '' : 'Las contraseñas no coinciden';
  return !hayErrores(errores);
}

async function registrar(): Promise<void> {
  errorGeneral.value = '';
  if (!validar()) return;

  enviando.value = true;
  try {
    const { nombre, correo, contrasena } = formulario;
    await crearCuenta({ nombre, correo, contrasena });
    router.push('/dashboard');
  } catch (error) {
    errorGeneral.value = describirError(error, 'No pudimos crear la cuenta.');
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
        <h1 class="text-4xl leading-tight font-bold tracking-tight">
          Tu negocio de arriendos, en orden.
        </h1>
        <p class="text-[17px] leading-relaxed text-borde">
          Crea tu cuenta de propietario y empieza por registrar tu primera propiedad.
        </p>
      </div>
      <span class="relative text-[13px] text-borde">© KeyRing · Propiedades en equilibrio</span>
    </aside>

    <main class="flex flex-[999_1_560px] items-center justify-center px-6 py-12">
      <form class="flex w-full max-w-md flex-col gap-5" novalidate @submit.prevent="registrar">
        <div class="flex flex-col gap-2">
          <h2 class="text-3xl font-bold tracking-tight">Crear cuenta</h2>
          <p class="text-[15px] text-apagado">Es gratis y solo toma un minuto.</p>
        </div>

        <AvisoError :mensaje="errorGeneral" />

        <CampoTexto
          v-model="formulario.nombre"
          etiqueta="Nombre completo"
          :error="errores.nombre"
        />
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
          :ayuda="`Mínimo ${LARGO_MINIMO_CONTRASENA} caracteres.`"
          :error="errores.contrasena"
        />
        <CampoTexto
          v-model="formulario.confirmacion"
          etiqueta="Repite la contraseña"
          tipo="password"
          :error="errores.confirmacion"
        />

        <button type="submit" class="boton-primario h-12 text-base" :disabled="enviando">
          {{ enviando ? 'Creando cuenta…' : 'Crear cuenta' }}
        </button>

        <p class="text-center text-sm text-apagado">
          ¿Ya tienes cuenta?
          <RouterLink to="/ingresar" class="font-semibold text-marca">Inicia sesión</RouterLink>
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
