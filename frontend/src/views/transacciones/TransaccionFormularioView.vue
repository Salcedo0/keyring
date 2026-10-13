<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AvisoError from '@/components/base/AvisoError.vue';
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue';
import CampoSelector from '@/components/formulario/CampoSelector.vue';
import CampoTexto from '@/components/formulario/CampoTexto.vue';
import GrupoOpciones from '@/components/formulario/GrupoOpciones.vue';
import { useConsulta } from '@/composables/useConsulta';
import type { GuardarTransaccionDTO } from '@/dtos/GuardarTransaccionDTO';
import type { TipoTransaccion } from '@/interfaces/TransaccionInterface';
import { ContratoService } from '@/services/ContratoService';
import { describirError } from '@/services/http';
import { PropiedadService } from '@/services/PropiedadService';
import { TransaccionService } from '@/services/TransaccionService';
import { aOpciones, TIPOS_TRANSACCION } from '@/utils/etiquetas';
import { hoy } from '@/utils/fechas';
import { formatearFecha, formatearPesos } from '@/utils/formato';
import { hayErrores } from '@/utils/validaciones';

// Los campos que el usuario debe elegir empiezan en null.
interface FormularioTransaccion {
  propiedadId: number | null;
  contratoId: number | null;
  tipo: TipoTransaccion | null;
  categoria: string | null;
  monto: number | null;
  fecha: string;
  descripcion: string;
}

const OPCIONES_TIPO = aOpciones(TIPOS_TRANSACCION);

const ruta = useRoute();
const router = useRouter();

const id = computed(() => (ruta.params.id ? Number(ruta.params.id) : null));
const esEdicion = computed(() => id.value !== null);

const formulario = reactive<FormularioTransaccion>({
  propiedadId: null,
  contratoId: null,
  tipo: null,
  categoria: null,
  monto: null,
  fecha: hoy(),
  descripcion: '',
});
const errores = reactive({
  propiedadId: '',
  tipo: '',
  categoria: '',
  monto: '',
  fecha: '',
  descripcion: '',
});
const errorGeneral = ref('');
const enviando = ref(false);

const propiedades = useConsulta(() => PropiedadService.obtenerPropiedades(), []);
const categorias = useConsulta(() => TransaccionService.obtenerCategorias(), []);
// Solo se ofrecen los contratos de la propiedad elegida.
const contratos = useConsulta(
  () => ContratoService.obtenerContratos({ propiedadId: formulario.propiedadId }),
  [],
);

const opcionesPropiedad = computed(() =>
  propiedades.datos.value.map((propiedad) => ({ valor: propiedad.id, texto: propiedad.nombre })),
);

const opcionesContrato = computed(() => [
  { valor: null, texto: 'Sin contrato' },
  ...contratos.datos.value.map((contrato) => ({
    valor: contrato.id,
    texto: `${contrato.inquilinoNombre} · ${formatearFecha(contrato.fechaInicio)}`,
  })),
]);

// La categoría tiene que ser del mismo tipo que la transacción.
const opcionesCategoria = computed(() =>
  categorias.datos.value
    .filter((categoria) => categoria.tipo === formulario.tipo)
    .map((categoria) => ({ valor: categoria.nombre, texto: categoria.nombre })),
);

const textoVacioCategoria = computed(() =>
  formulario.tipo ? 'Selecciona una categoría' : 'Primero elige si es ingreso o gasto',
);

const ayudaMonto = computed(() =>
  formulario.monto ? formatearPesos(formulario.monto) : 'Valor en pesos, sin puntos',
);

async function cargarTransaccion(): Promise<void> {
  if (id.value === null) return;
  try {
    const transaccion = await TransaccionService.obtenerTransaccion(id.value);
    const { id: _id, propiedadNombre: _propiedad, ...datos } = transaccion;
    Object.assign(formulario, datos);
  } catch (error) {
    errorGeneral.value = describirError(error, 'No se pudo cargar la transacción.');
  }
}

function validar(): boolean {
  errores.propiedadId = formulario.propiedadId === null ? 'Elige la propiedad' : '';
  errores.tipo = formulario.tipo ? '' : 'Elige si es ingreso o gasto';
  errores.categoria = formulario.categoria === null ? 'Selecciona una categoría' : '';
  errores.monto = formulario.monto && formulario.monto > 0 ? '' : 'El monto debe ser mayor a $0';
  errores.fecha = formulario.fecha ? '' : 'Elige la fecha';
  errores.descripcion = formulario.descripcion.length > 200 ? 'Máximo 200 caracteres' : '';
  return !hayErrores(errores);
}

async function guardar(): Promise<void> {
  errorGeneral.value = '';
  if (!validar()) return;

  enviando.value = true;
  try {
    // Después de validar, los campos que empezaban en null ya tienen valor.
    const datos = formulario as GuardarTransaccionDTO;
    if (id.value === null) await TransaccionService.crearTransaccion(datos);
    else await TransaccionService.actualizarTransaccion(id.value, datos);
    router.push('/transacciones');
  } catch (error) {
    errorGeneral.value = describirError(error, 'No se pudo guardar la transacción.');
  } finally {
    enviando.value = false;
  }
}

/** Al cambiar de propiedad, el contrato elegido ya no aplica: se borra y se piden los nuevos. */
function alCambiarPropiedad(nueva: number | null, anterior: number | null): void {
  if (anterior !== null) formulario.contratoId = null;
  if (nueva !== null) contratos.cargar();
}

/** Al cambiar entre ingreso y gasto, la categoría elegida deja de servir. */
function alCambiarTipo(_nuevo: TipoTransaccion | null, anterior: TipoTransaccion | null): void {
  if (anterior !== null) formulario.categoria = null;
}

onMounted(() => {
  propiedades.cargar();
  categorias.cargar();
  cargarTransaccion();
});

watch(() => formulario.propiedadId, alCambiarPropiedad);
watch(() => formulario.tipo, alCambiarTipo);
</script>

<template>
  <EncabezadoPagina
    :titulo="esEdicion ? 'Editar transacción' : 'Nueva transacción'"
    descripcion="Registra un ingreso o un gasto y, si aplica, vincúlalo a un contrato."
  />

  <AvisoError :mensaje="errorGeneral || propiedades.error.value || categorias.error.value" />

  <form class="tarjeta flex max-w-4xl flex-col" novalidate @submit.prevent="guardar">
    <div class="flex flex-col gap-5 p-7">
      <GrupoOpciones
        v-model="formulario.tipo"
        etiqueta="Tipo"
        :opciones="OPCIONES_TIPO"
        obligatorio
        :error="errores.tipo"
      />

      <div class="flex flex-wrap gap-4">
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
          <CampoSelector
            v-model="formulario.contratoId"
            etiqueta="Contrato (opcional)"
            :opciones="opcionesContrato"
            ayuda="Solo aparecen los contratos de la propiedad elegida."
          />
        </div>
      </div>

      <div class="flex flex-wrap items-start gap-4">
        <div class="min-w-56 flex-1">
          <CampoSelector
            v-model="formulario.categoria"
            etiqueta="Categoría"
            :opciones="opcionesCategoria"
            :texto-vacio="textoVacioCategoria"
            obligatorio
            :error="errores.categoria"
          />
        </div>
        <div class="min-w-48 flex-1">
          <CampoTexto
            v-model="formulario.monto"
            etiqueta="Monto (COP)"
            tipo="number"
            placeholder="0"
            obligatorio
            :ayuda="ayudaMonto"
            :error="errores.monto"
          />
        </div>
        <div class="min-w-44 flex-1">
          <CampoTexto
            v-model="formulario.fecha"
            etiqueta="Fecha"
            tipo="date"
            obligatorio
            :error="errores.fecha"
          />
        </div>
      </div>

      <CampoTexto
        v-model="formulario.descripcion"
        etiqueta="Descripción"
        placeholder="Ej. Reparación del calentador a gas"
        multilinea
        ayuda="Máximo 200 caracteres."
        :error="errores.descripcion"
      />
    </div>

    <div class="flex flex-wrap justify-end gap-3 border-t border-fondo px-7 py-4">
      <RouterLink to="/transacciones" class="boton-secundario">Cancelar</RouterLink>
      <button type="submit" class="boton-primario" :disabled="enviando">
        {{ esEdicion ? 'Guardar cambios' : 'Registrar transacción' }}
      </button>
    </div>
  </form>
</template>
