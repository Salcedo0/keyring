<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import CampoSelector from '@/components/formulario/CampoSelector.vue'
import CampoTexto from '@/components/formulario/CampoTexto.vue'
import GrupoOpciones from '@/components/formulario/GrupoOpciones.vue'
import SelectorUbicacion from '@/components/mapa/SelectorUbicacion.vue'
import type { GuardarPropiedadDTO } from '@/dtos/GuardarPropiedadDTO'
import type { Modalidad, TipoPropiedad } from '@/interfaces/PropiedadInterface'
import { describirError } from '@/services/http'
import { actualizarPropiedad, crearPropiedad, obtenerPropiedad } from '@/services/PropiedadService'
import { aOpciones, MODALIDADES, TIPOS_PROPIEDAD } from '@/utils/etiquetas'
import { estaVacio, hayErrores } from '@/utils/validaciones'

// El formulario empieza sin tipo ni modalidad: el usuario los debe elegir.
interface FormularioPropiedad extends Omit<GuardarPropiedadDTO, 'tipo' | 'modalidad'> {
  tipo: TipoPropiedad | null
  modalidad: Modalidad | null
}

const ruta = useRoute()
const router = useRouter()

// Si la ruta trae id se está editando; si no, se está creando.
const id = computed(() => (ruta.params.id ? Number(ruta.params.id) : null))
const esEdicion = computed(() => id.value !== null)

const formulario = reactive<FormularioPropiedad>({
  nombre: '',
  direccion: '',
  ciudad: '',
  tipo: null,
  modalidad: null,
  latitud: null,
  longitud: null,
})
const errores = reactive({
  nombre: '',
  direccion: '',
  ciudad: '',
  tipo: '',
  modalidad: '',
  ubicacion: '',
})
const errorGeneral = ref('')
const enviando = ref(false)

const opcionesTipo = aOpciones(TIPOS_PROPIEDAD)
const opcionesModalidad = aOpciones(MODALIDADES)

async function cargarPropiedad(): Promise<void> {
  if (id.value === null) return
  try {
    // El id no hace parte del formulario: va en la URL al guardar.
    const { id: _id, ...propiedad } = await obtenerPropiedad(id.value)
    Object.assign(formulario, propiedad)
  } catch (error) {
    errorGeneral.value = describirError(error, 'No se pudo cargar la propiedad.')
  }
}

function validar(): boolean {
  errores.nombre = estaVacio(formulario.nombre) ? 'Escribe un nombre para reconocerla' : ''
  errores.direccion = estaVacio(formulario.direccion) ? 'La dirección es obligatoria' : ''
  errores.ciudad = estaVacio(formulario.ciudad) ? 'La ciudad es obligatoria' : ''
  errores.tipo = formulario.tipo ? '' : 'Elige el tipo de inmueble'
  errores.modalidad = formulario.modalidad ? '' : 'Elige la modalidad de arriendo'
  errores.ubicacion = formulario.latitud === null ? 'Marca la ubicación en el mapa' : ''
  return !hayErrores(errores)
}

async function guardar(): Promise<void> {
  errorGeneral.value = ''
  if (!validar()) return

  enviando.value = true
  try {
    // Después de validar, tipo y modalidad ya tienen valor.
    const datos = formulario as GuardarPropiedadDTO
    if (id.value === null) await crearPropiedad(datos)
    else await actualizarPropiedad(id.value, datos)
    router.push('/propiedades')
  } catch (error) {
    errorGeneral.value = describirError(error, 'No se pudo guardar la propiedad.')
  } finally {
    enviando.value = false
  }
}

onMounted(cargarPropiedad)
</script>

<template>
  <EncabezadoPagina
    :titulo="esEdicion ? 'Editar propiedad' : 'Nueva propiedad'"
    descripcion="Los campos marcados con * son obligatorios."
  />

  <AvisoError :mensaje="errorGeneral" />

  <form class="tarjeta flex flex-col" novalidate @submit.prevent="guardar">
    <div class="flex flex-wrap gap-8 p-7">
      <div class="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
        <h2 class="text-[17px] font-bold">Datos de la propiedad</h2>
        <CampoTexto
          v-model="formulario.nombre"
          etiqueta="Nombre"
          placeholder="Ej. Apto Poblado 1203"
          obligatorio
          :error="errores.nombre"
        />
        <CampoTexto
          v-model="formulario.direccion"
          etiqueta="Dirección"
          placeholder="Ej. Cra. 37 #8A-42"
          obligatorio
          :error="errores.direccion"
        />
        <div class="flex flex-wrap gap-4">
          <div class="min-w-44 flex-1">
            <CampoTexto
              v-model="formulario.ciudad"
              etiqueta="Ciudad"
              obligatorio
              :error="errores.ciudad"
            />
          </div>
          <div class="min-w-44 flex-1">
            <CampoSelector
              v-model="formulario.tipo"
              etiqueta="Tipo"
              :opciones="opcionesTipo"
              texto-vacio="Selecciona un tipo"
              obligatorio
              :error="errores.tipo"
            />
          </div>
        </div>
        <GrupoOpciones
          v-model="formulario.modalidad"
          etiqueta="Modalidad de arriendo"
          :opciones="opcionesModalidad"
          obligatorio
          :error="errores.modalidad"
        />
      </div>

      <div class="min-w-0 flex-[1_1_420px]">
        <SelectorUbicacion
          v-model:latitud="formulario.latitud"
          v-model:longitud="formulario.longitud"
          :error="errores.ubicacion"
        />
      </div>
    </div>

    <div class="flex flex-wrap justify-end gap-3 border-t border-fondo px-7 py-4">
      <RouterLink to="/propiedades" class="boton-secundario">Cancelar</RouterLink>
      <button type="submit" class="boton-primario" :disabled="enviando">
        {{ esEdicion ? 'Guardar cambios' : 'Crear propiedad' }}
      </button>
    </div>
  </form>
</template>
