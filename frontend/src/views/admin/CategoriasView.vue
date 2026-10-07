<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import Icono from '@/components/base/Icono.vue'
import InsigniaEstado from '@/components/base/InsigniaEstado.vue'
import CampoTexto from '@/components/formulario/CampoTexto.vue'
import GrupoOpciones from '@/components/formulario/GrupoOpciones.vue'
import TablaDatos from '@/components/tabla/TablaDatos.vue'
import { useConsulta } from '@/composables/useConsulta'
import type { Categoria } from '@/interfaces/CategoriaInterface'
import type { Columna } from '@/interfaces/OpcionInterface'
import type { TipoTransaccion } from '@/interfaces/TransaccionInterface'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategorias,
} from '@/services/CategoriaService'
import { describirError } from '@/services/http'
import { aOpciones, TIPOS_TRANSACCION, TONOS_TRANSACCION } from '@/utils/etiquetas'
import { estaVacio, hayErrores } from '@/utils/validaciones'

const COLUMNAS: Columna[] = [
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'tipo', titulo: 'Tipo' },
]

const OPCIONES_TIPO = aOpciones(TIPOS_TRANSACCION)

// id null: el formulario está creando una categoría nueva.
const formulario = reactive<{ id: number | null; nombre: string; tipo: TipoTransaccion | null }>({
  id: null,
  nombre: '',
  tipo: null,
})
const errores = reactive({ nombre: '', tipo: '' })
const errorGeneral = ref('')
const enviando = ref(false)

const { datos: categorias, cargando, error, cargar } = useConsulta(obtenerCategorias, [])

const esEdicion = computed(() => formulario.id !== null)

function limpiarFormulario(): void {
  Object.assign(formulario, { id: null, nombre: '', tipo: null })
  Object.assign(errores, { nombre: '', tipo: '' })
  errorGeneral.value = ''
}

function editar(categoria: Categoria): void {
  limpiarFormulario()
  Object.assign(formulario, categoria)
}

function validar(): boolean {
  errores.nombre = estaVacio(formulario.nombre) ? 'El nombre es obligatorio' : ''
  errores.tipo = formulario.tipo ? '' : 'Elige si es de ingreso o de gasto'
  return !hayErrores(errores)
}

async function guardar(): Promise<void> {
  errorGeneral.value = ''
  if (!validar() || !formulario.tipo) return

  enviando.value = true
  try {
    const datos = { nombre: formulario.nombre.trim(), tipo: formulario.tipo }
    if (formulario.id === null) await crearCategoria(datos)
    else await actualizarCategoria(formulario.id, datos)
    limpiarFormulario()
    await cargar()
  } catch (problema) {
    errorGeneral.value = describirError(problema, 'No se pudo guardar la categoría.')
  } finally {
    enviando.value = false
  }
}

async function eliminar(categoria: Categoria): Promise<void> {
  if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return
  errorGeneral.value = ''
  try {
    await eliminarCategoria(categoria.id)
    if (formulario.id === categoria.id) limpiarFormulario()
    await cargar()
  } catch (problema) {
    errorGeneral.value = describirError(problema, 'No se pudo eliminar la categoría.')
  }
}

onMounted(cargar)
</script>

<template>
  <EncabezadoPagina
    titulo="Categorías de transacción"
    descripcion="Las categorías se comparten entre todos los propietarios."
  >
    <template #acciones>
      <button type="button" class="boton-primario" @click="limpiarFormulario">
        <Icono nombre="mas" :tamano="18" /> Nueva categoría
      </button>
    </template>
  </EncabezadoPagina>

  <AvisoError :mensaje="error || errorGeneral" />

  <div class="flex flex-wrap items-start gap-5">
    <section class="tarjeta min-w-0 flex-[3_1_560px] overflow-hidden">
      <TablaDatos
        :columnas="COLUMNAS"
        :filas="categorias"
        :cargando="cargando"
        mensaje-vacio="Crea la primera categoría con el formulario."
        @editar="editar"
        @eliminar="eliminar"
      >
        <template #celda-nombre="{ fila }">
          <span class="font-semibold">{{ fila.nombre }}</span>
        </template>
        <template #celda-tipo="{ fila }">
          <InsigniaEstado
            :texto="TIPOS_TRANSACCION[fila.tipo]"
            :tono="TONOS_TRANSACCION[fila.tipo]"
          />
        </template>
      </TablaDatos>
    </section>

    <form
      class="tarjeta flex min-w-0 flex-[1_1_320px] flex-col gap-5 p-6"
      novalidate
      @submit.prevent="guardar"
    >
      <h2 class="text-[17px] font-bold">
        {{ esEdicion ? 'Editar categoría' : 'Nueva categoría' }}
      </h2>
      <CampoTexto
        v-model="formulario.nombre"
        etiqueta="Nombre"
        placeholder="Ej. Seguros"
        obligatorio
        :error="errores.nombre"
      />
      <GrupoOpciones
        v-model="formulario.tipo"
        etiqueta="Tipo"
        :opciones="OPCIONES_TIPO"
        obligatorio
        :error="errores.tipo"
      />
      <div class="flex justify-end gap-2.5 border-t border-fondo pt-5">
        <button type="button" class="boton-secundario" @click="limpiarFormulario">Cancelar</button>
        <button type="submit" class="boton-primario" :disabled="enviando">
          {{ esEdicion ? 'Guardar cambios' : 'Crear categoría' }}
        </button>
      </div>
    </form>
  </div>
</template>
