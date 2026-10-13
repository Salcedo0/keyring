<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import AvisoError from '@/components/base/AvisoError.vue';
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue';
import Icono from '@/components/base/Icono.vue';
import InsigniaEstado from '@/components/base/InsigniaEstado.vue';
import FiltroSelector from '@/components/formulario/FiltroSelector.vue';
import TablaDatos from '@/components/tabla/TablaDatos.vue';
import { useConsulta } from '@/composables/useConsulta';
import type { ContratoInterface, FiltrosContratos } from '@/interfaces/ContratoInterface';
import type { Columna } from '@/interfaces/OpcionInterface';
import { ContratoService } from '@/services/ContratoService';
import { describirError } from '@/services/http';
import { PropiedadService } from '@/services/PropiedadService';
import {
  aOpcionesConTodos,
  ESTADOS_CONTRATO,
  TIPOS_CONTRATO,
  TONOS_ESTADO_CONTRATO,
} from '@/utils/etiquetas';
import { formatearFecha, formatearPesos } from '@/utils/formato';

const COLUMNAS: Columna[] = [
  { clave: 'propiedadNombre', titulo: 'Propiedad' },
  { clave: 'inquilinoNombre', titulo: 'Inquilino' },
  { clave: 'tipo', titulo: 'Tipo' },
  { clave: 'fechaInicio', titulo: 'Inicio' },
  { clave: 'fechaFin', titulo: 'Fin' },
  { clave: 'valor', titulo: 'Valor', alineacion: 'derecha' },
  { clave: 'estado', titulo: 'Estado' },
];

const OPCIONES_ESTADO = aOpcionesConTodos(ESTADOS_CONTRATO, 'Todos los estados');

const router = useRouter();
const filtros = reactive<FiltrosContratos>({ propiedadId: null, estado: null });
const errorAccion = ref('');

const propiedades = useConsulta(() => PropiedadService.obtenerPropiedades(), []);
const contratos = useConsulta(() => ContratoService.obtenerContratos(filtros), []);

const opcionesPropiedad = computed(() => [
  { valor: null, texto: 'Todas las propiedades' },
  ...propiedades.datos.value.map((propiedad) => ({ valor: propiedad.id, texto: propiedad.nombre })),
]);

const hayFiltros = computed(() => filtros.propiedadId !== null || filtros.estado !== null);

const mensajeVacio = computed(() =>
  hayFiltros.value
    ? 'Ningún contrato coincide con estos filtros.'
    : 'Cuando registres tu primer contrato aparecerá aquí.',
);

function editar(contrato: ContratoInterface): void {
  router.push(`/contratos/${contrato.id}/editar`);
}

async function eliminar(contrato: ContratoInterface): Promise<void> {
  const pregunta = `¿Eliminar el contrato de ${contrato.inquilinoNombre}? Esta acción no se puede deshacer.`;
  if (!window.confirm(pregunta)) return;
  errorAccion.value = '';
  try {
    await ContratoService.eliminarContrato(contrato.id);
    await contratos.cargar();
  } catch (error) {
    errorAccion.value = describirError(error, 'No se pudo eliminar el contrato.');
  }
}

function limpiarFiltros(): void {
  filtros.propiedadId = null;
  filtros.estado = null;
}

onMounted(() => {
  propiedades.cargar();
  contratos.cargar();
});

watch(filtros, contratos.cargar);
</script>

<template>
  <EncabezadoPagina titulo="Contratos" descripcion="Arriendos fijos y reservas de corta estancia.">
    <template #acciones>
      <RouterLink to="/contratos/nuevo" class="boton-primario">
        <Icono nombre="mas" :tamano="18" /> Nuevo contrato
      </RouterLink>
    </template>
  </EncabezadoPagina>

  <AvisoError :mensaje="contratos.error.value || propiedades.error.value || errorAccion" />

  <section class="tarjeta overflow-hidden">
    <div class="flex flex-wrap items-end gap-4 border-b border-fondo p-5">
      <FiltroSelector
        v-model="filtros.propiedadId"
        etiqueta="Propiedad"
        :opciones="opcionesPropiedad"
      />
      <FiltroSelector v-model="filtros.estado" etiqueta="Estado" :opciones="OPCIONES_ESTADO" />
    </div>

    <TablaDatos
      :columnas="COLUMNAS"
      :filas="contratos.datos.value"
      :cargando="contratos.cargando.value"
      :mensaje-vacio="mensajeVacio"
      @editar="editar"
      @eliminar="eliminar"
    >
      <template #celda-propiedadNombre="{ fila }">
        <span class="font-semibold">{{ fila.propiedadNombre }}</span>
      </template>
      <template #celda-inquilinoNombre="{ fila }">
        <div class="font-medium">{{ fila.inquilinoNombre }}</div>
        <div class="text-xs text-apagado">{{ fila.inquilinoDocumento }}</div>
      </template>
      <template #celda-tipo="{ fila }">{{ TIPOS_CONTRATO[fila.tipo] }}</template>
      <template #celda-fechaInicio="{ fila }">{{ formatearFecha(fila.fechaInicio) }}</template>
      <template #celda-fechaFin="{ fila }">{{ formatearFecha(fila.fechaFin) }}</template>
      <template #celda-valor="{ fila }">
        <span class="font-bold tabular-nums">{{ formatearPesos(fila.valor) }}</span>
        <span v-if="fila.tipo === 'FIJA'" class="text-xs text-apagado"> /mes</span>
      </template>
      <template #celda-estado="{ fila }">
        <InsigniaEstado
          :texto="ESTADOS_CONTRATO[fila.estado]"
          :tono="TONOS_ESTADO_CONTRATO[fila.estado]"
        />
      </template>
      <template #vacio>
        <button
          v-if="hayFiltros"
          type="button"
          class="boton-secundario mt-1.5"
          @click="limpiarFiltros"
        >
          Limpiar filtros
        </button>
      </template>
    </TablaDatos>
  </section>
</template>
