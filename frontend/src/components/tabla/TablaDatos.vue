<script setup lang="ts" generic="T extends { id: number }">
import EstadoVacio from '@/components/base/EstadoVacio.vue';
import Icono from '@/components/base/Icono.vue';
import type { Columna } from '@/interfaces/OpcionInterface';

const {
  cargando = false,
  acciones = ['editar', 'eliminar'],
  mensajeVacio,
} = defineProps<{
  columnas: Columna[];
  filas: T[];
  cargando?: boolean;
  /** Qué botones se muestran al final de cada fila. Lista vacía: sin columna de acciones. */
  acciones?: ('editar' | 'eliminar')[];
  mensajeVacio?: string;
}>();

const emit = defineEmits<{
  editar: [fila: T];
  eliminar: [fila: T];
}>();

/** Valor de una celda cuando no se usa un slot personalizado para esa columna. */
function valorCelda(fila: T, clave: string): unknown {
  return (fila as Record<string, unknown>)[clave];
}
</script>

<template>
  <!--
    Para mostrar una celda de forma especial (insignia, monto con color…) se usa un slot con el
    nombre de la columna:  <template #celda-estado="{ fila }"> … </template>
  -->
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th
            v-for="columna in columnas"
            :key="columna.clave"
            class="border-b border-borde bg-fondo-suave px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-apagado uppercase"
            :class="columna.alineacion === 'derecha' ? 'text-right' : 'text-left'"
          >
            {{ columna.titulo }}
          </th>
          <th
            v-if="acciones.length > 0"
            class="border-b border-borde bg-fondo-suave px-4 py-3 text-right text-xs font-semibold tracking-wide text-apagado uppercase"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody v-if="!cargando">
        <tr v-for="fila in filas" :key="fila.id" class="hover:bg-fondo-suave">
          <td
            v-for="columna in columnas"
            :key="columna.clave"
            class="border-b border-fondo px-4 py-3 whitespace-nowrap"
            :class="{ 'text-right': columna.alineacion === 'derecha' }"
          >
            <slot :name="`celda-${columna.clave}`" :fila="fila">
              {{ valorCelda(fila, columna.clave) }}
            </slot>
          </td>
          <td v-if="acciones.length > 0" class="border-b border-fondo px-4 py-2 text-right">
            <span class="inline-flex gap-1.5">
              <button
                v-if="acciones.includes('editar')"
                type="button"
                class="boton-icono"
                aria-label="Editar"
                title="Editar"
                @click="emit('editar', fila)"
              >
                <Icono nombre="editar" :tamano="17" />
              </button>
              <button
                v-if="acciones.includes('eliminar')"
                type="button"
                class="boton-icono text-gasto"
                aria-label="Eliminar"
                title="Eliminar"
                @click="emit('eliminar', fila)"
              >
                <Icono nombre="eliminar" :tamano="17" />
              </button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-if="cargando" class="px-4 py-10 text-center text-sm text-apagado">Cargando…</p>
  <EstadoVacio v-else-if="filas.length === 0" :mensaje="mensajeVacio">
    <slot name="vacio" />
  </EstadoVacio>
</template>
