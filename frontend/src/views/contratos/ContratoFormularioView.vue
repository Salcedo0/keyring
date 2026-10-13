<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AvisoError from '@/components/base/AvisoError.vue';
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue';
import CampoSelector from '@/components/formulario/CampoSelector.vue';
import CampoTexto from '@/components/formulario/CampoTexto.vue';
import GrupoOpciones from '@/components/formulario/GrupoOpciones.vue';
import { useConsulta } from '@/composables/useConsulta';
import type { GuardarContratoDTO } from '@/dtos/GuardarContratoDTO';
import type { EstadoContrato, TipoContrato } from '@/interfaces/ContratoInterface';
import { ContratoService } from '@/services/ContratoService';
import { describirError } from '@/services/http';
import { PropiedadService } from '@/services/PropiedadService';
import { aOpciones, ESTADOS_CONTRATO, TIPOS_CONTRATO } from '@/utils/etiquetas';
import { formatearPesos } from '@/utils/formato';
import { esCorreoValido, estaVacio, hayErrores } from '@/utils/validaciones';

// Los campos que el usuario debe elegir empiezan en null.
interface FormularioContrato {
  propiedadId: number | null;
  inquilinoNombre: string;
  inquilinoDocumento: string;
  inquilinoCorreo: string;
  inquilinoTelefono: string;
  tipo: TipoContrato | null;
  fechaInicio: string;
  fechaFin: string;
  valor: number | null;
  estado: EstadoContrato;
}

const OPCIONES_TIPO = aOpciones(TIPOS_CONTRATO);
const OPCIONES_ESTADO = aOpciones(ESTADOS_CONTRATO);

const ruta = useRoute();
const router = useRouter();

const id = computed(() => (ruta.params.id ? Number(ruta.params.id) : null));
const esEdicion = computed(() => id.value !== null);

const formulario = reactive<FormularioContrato>({
  propiedadId: null,
  inquilinoNombre: '',
  inquilinoDocumento: '',
  inquilinoCorreo: '',
  inquilinoTelefono: '',
  tipo: null,
  fechaInicio: '',
  fechaFin: '',
  valor: null,
  estado: 'PENDIENTE',
});
const errores = reactive({
  propiedadId: '',
  inquilinoNombre: '',
  inquilinoDocumento: '',
  inquilinoCorreo: '',
  tipo: '',
  fechaInicio: '',
  fechaFin: '',
  valor: '',
});
const errorGeneral = ref('');
const enviando = ref(false);

const propiedades = useConsulta(() => PropiedadService.obtenerPropiedades(), []);

const opcionesPropiedad = computed(() =>
  propiedades.datos.value.map((propiedad) => ({ valor: propiedad.id, texto: propiedad.nombre })),
);

// Debajo del valor se muestra cómo queda en pesos, para evitar errores de ceros.
const ayudaValor = computed(() => {
  if (!formulario.valor) return 'En contrato fijo, escribe el canon mensual.';
  const periodo = formulario.tipo === 'FIJA' ? ' por mes' : ' en total';
  return formatearPesos(formulario.valor) + periodo;
});

async function cargarContrato(): Promise<void> {
  if (id.value === null) return;
  try {
    const {
      id: _id,
      propiedadNombre: _nombre,
      ...contrato
    } = await ContratoService.obtenerContrato(id.value);
    Object.assign(formulario, contrato);
  } catch (error) {
    errorGeneral.value = describirError(error, 'No se pudo cargar el contrato.');
  }
}

function validar(): boolean {
  errores.propiedadId = formulario.propiedadId === null ? 'Elige la propiedad' : '';
  errores.inquilinoNombre = estaVacio(formulario.inquilinoNombre)
    ? 'Escribe el nombre del inquilino'
    : '';
  errores.inquilinoDocumento = estaVacio(formulario.inquilinoDocumento)
    ? 'Escribe el número de documento'
    : '';
  errores.inquilinoCorreo = esCorreoValido(formulario.inquilinoCorreo)
    ? ''
    : 'Ingresa un correo válido, por ejemplo nombre@correo.com';
  errores.tipo = formulario.tipo ? '' : 'Elige el tipo de contrato';
  errores.fechaInicio = formulario.fechaInicio ? '' : 'Elige la fecha de inicio';
  errores.fechaFin =
    formulario.fechaFin > formulario.fechaInicio ? '' : 'Debe ser posterior a la fecha de inicio';
  errores.valor = formulario.valor && formulario.valor > 0 ? '' : 'El valor debe ser mayor a $0';
  return !hayErrores(errores);
}

async function guardar(): Promise<void> {
  errorGeneral.value = '';
  if (!validar()) return;

  enviando.value = true;
  try {
    // Después de validar, los campos que empezaban en null ya tienen valor.
    const datos = formulario as GuardarContratoDTO;
    if (id.value === null) await ContratoService.crearContrato(datos);
    else await ContratoService.actualizarContrato(id.value, datos);
    router.push('/contratos');
  } catch (error) {
    errorGeneral.value = describirError(error, 'No se pudo guardar el contrato.');
  } finally {
    enviando.value = false;
  }
}

onMounted(() => {
  propiedades.cargar();
  cargarContrato();
});
</script>

<template>
  <EncabezadoPagina
    :titulo="esEdicion ? 'Editar contrato' : 'Nuevo contrato'"
    descripcion="Los campos marcados con * son obligatorios."
  />

  <AvisoError :mensaje="errorGeneral || propiedades.error.value" />

  <form class="tarjeta flex flex-col" novalidate @submit.prevent="guardar">
    <section class="flex flex-col gap-5 border-b border-fondo p-7">
      <h2 class="text-[17px] font-bold">Propiedad y tipo</h2>
      <div class="flex flex-wrap items-start gap-4">
        <div class="min-w-64 flex-1">
          <CampoSelector
            v-model="formulario.propiedadId"
            etiqueta="Propiedad"
            :opciones="opcionesPropiedad"
            texto-vacio="Selecciona una propiedad"
            obligatorio
            :error="errores.propiedadId"
          />
        </div>
        <div class="min-w-64 flex-1">
          <GrupoOpciones
            v-model="formulario.tipo"
            etiqueta="Tipo de contrato"
            :opciones="OPCIONES_TIPO"
            obligatorio
            :error="errores.tipo"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-5 border-b border-fondo p-7">
      <h2 class="text-[17px] font-bold">Inquilino</h2>
      <CampoTexto
        v-model="formulario.inquilinoNombre"
        etiqueta="Nombre completo"
        obligatorio
        :error="errores.inquilinoNombre"
      />
      <div class="flex flex-wrap gap-4">
        <div class="min-w-56 flex-1">
          <CampoTexto
            v-model="formulario.inquilinoDocumento"
            etiqueta="Documento"
            placeholder="CC, CE, pasaporte o NIT"
            obligatorio
            :error="errores.inquilinoDocumento"
          />
        </div>
        <div class="min-w-56 flex-1">
          <CampoTexto
            v-model="formulario.inquilinoCorreo"
            etiqueta="Correo electrónico"
            tipo="email"
            placeholder="nombre@correo.com"
            obligatorio
            :error="errores.inquilinoCorreo"
          />
        </div>
        <div class="min-w-56 flex-1">
          <CampoTexto
            v-model="formulario.inquilinoTelefono"
            etiqueta="Teléfono"
            tipo="tel"
            placeholder="300 000 0000"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-5 p-7">
      <h2 class="text-[17px] font-bold">Fechas, valor y estado</h2>
      <div class="flex flex-wrap items-start gap-4">
        <div class="min-w-48 flex-1">
          <CampoTexto
            v-model="formulario.fechaInicio"
            etiqueta="Fecha de inicio"
            tipo="date"
            obligatorio
            :error="errores.fechaInicio"
          />
        </div>
        <div class="min-w-48 flex-1">
          <CampoTexto
            v-model="formulario.fechaFin"
            etiqueta="Fecha de fin"
            tipo="date"
            obligatorio
            :error="errores.fechaFin"
          />
        </div>
        <div class="min-w-48 flex-1">
          <CampoTexto
            v-model="formulario.valor"
            etiqueta="Valor (COP)"
            tipo="number"
            placeholder="0"
            obligatorio
            :ayuda="ayudaValor"
            :error="errores.valor"
          />
        </div>
        <div class="min-w-48 flex-1">
          <CampoSelector
            v-model="formulario.estado"
            etiqueta="Estado"
            :opciones="OPCIONES_ESTADO"
            obligatorio
          />
        </div>
      </div>
    </section>

    <div class="flex flex-wrap justify-end gap-3 border-t border-fondo px-7 py-4">
      <RouterLink to="/contratos" class="boton-secundario">Cancelar</RouterLink>
      <button type="submit" class="boton-primario" :disabled="enviando">
        {{ esEdicion ? 'Guardar cambios' : 'Crear contrato' }}
      </button>
    </div>
  </form>
</template>
