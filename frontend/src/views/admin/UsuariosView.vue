<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import AvisoError from '@/components/base/AvisoError.vue'
import EncabezadoPagina from '@/components/base/EncabezadoPagina.vue'
import InsigniaEstado from '@/components/base/InsigniaEstado.vue'
import TarjetaGrafico from '@/components/base/TarjetaGrafico.vue'
import FiltroSelector from '@/components/formulario/FiltroSelector.vue'
import GraficoBarras from '@/components/graficos/GraficoBarras.vue'
import TablaDatos from '@/components/tabla/TablaDatos.vue'
import { useConsulta } from '@/composables/useConsulta'
import type { Columna } from '@/interfaces/OpcionInterface'
import type { Rol, Usuario } from '@/interfaces/UsuarioInterface'
import { describirError } from '@/services/http'
import { eliminarUsuario, obtenerResumenPorRol, obtenerUsuarios } from '@/services/UsuarioService'
import { aOpcionesConTodos, ROLES } from '@/utils/etiquetas'
import { PALETA_CATEGORIAS } from '@/utils/paleta'

const COLUMNAS: Columna[] = [
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'correo', titulo: 'Email' },
  { clave: 'rol', titulo: 'Rol' },
]

const OPCIONES_ROL = aOpcionesConTodos(ROLES, 'Todos los roles')

const filtroRol = ref<Rol | null>(null)
const errorAccion = ref('')

const usuarios = useConsulta(() => obtenerUsuarios(filtroRol.value), [])
const resumen = useConsulta(obtenerResumenPorRol, [])

const rolesResumen = computed(() => resumen.datos.value.map((fila) => fila.rol))
const cantidadesResumen = computed(() => resumen.datos.value.map((fila) => fila.cantidad))
const totalUsuarios = computed(() =>
  cantidadesResumen.value.reduce((suma, cantidad) => suma + cantidad, 0),
)

async function eliminar(usuario: Usuario): Promise<void> {
  if (!window.confirm(`¿Eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`)) return
  errorAccion.value = ''
  try {
    await eliminarUsuario(usuario.id)
    usuarios.cargar()
    resumen.cargar()
  } catch (error) {
    errorAccion.value = describirError(error, 'No se pudo eliminar el usuario.')
  }
}

onMounted(() => {
  usuarios.cargar()
  resumen.cargar()
})

watch(filtroRol, usuarios.cargar)
</script>

<template>
  <EncabezadoPagina titulo="Usuarios" descripcion="Cuentas con acceso a KeyRing y su rol." />

  <AvisoError :mensaje="usuarios.error.value || resumen.error.value || errorAccion" />

  <div class="flex flex-wrap items-start gap-5">
    <section class="tarjeta min-w-0 flex-[3_1_600px] overflow-hidden">
      <div class="flex flex-wrap items-end gap-4 border-b border-fondo p-5">
        <div class="max-w-64 flex-1">
          <FiltroSelector v-model="filtroRol" etiqueta="Rol" :opciones="OPCIONES_ROL" />
        </div>
      </div>
      <TablaDatos
        :columnas="COLUMNAS"
        :filas="usuarios.datos.value"
        :cargando="usuarios.cargando.value"
        :acciones="['eliminar']"
        @eliminar="eliminar"
      >
        <template #celda-nombre="{ fila }">
          <span class="font-semibold">{{ fila.nombre }}</span>
        </template>
        <template #celda-rol="{ fila }">
          <InsigniaEstado
            :texto="ROLES[fila.rol]"
            :tono="fila.rol === 'ADMIN' ? 'marca' : 'gris'"
          />
        </template>
      </TablaDatos>
    </section>

    <div class="min-w-0 flex-[1_1_320px]">
      <TarjetaGrafico
        titulo="Usuarios por rol"
        :subtitulo="`${totalUsuarios} usuarios en total`"
        :hay-datos="rolesResumen.length > 0"
      >
        <GraficoBarras
          :etiquetas="rolesResumen"
          :valores="cantidadesResumen"
          :colores="PALETA_CATEGORIAS"
          :en-pesos="false"
        />
      </TarjetaGrafico>
    </div>
  </div>
</template>
