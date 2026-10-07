import { computed, ref } from 'vue'

import type { IngresoDTO } from '@/dtos/IngresoDTO'
import type { Usuario } from '@/interfaces/UsuarioInterface'
import { ingresar } from '@/services/AutenticacionService'
import { borrarSesion, guardarSesion, leerSesion } from '@/utils/almacenSesion'

// Vive fuera de la función para que todas las pantallas compartan el mismo usuario.
const usuario = ref<Usuario | null>(leerSesion()?.usuario ?? null)

/** Usuario actual, su rol y las acciones para entrar y salir. */
export function useSesion() {
  const estaAutenticado = computed(() => usuario.value !== null)
  const esAdmin = computed(() => usuario.value?.rol === 'ADMIN')

  async function iniciarSesion(datos: IngresoDTO): Promise<void> {
    const sesion = await ingresar(datos)
    guardarSesion(sesion)
    usuario.value = sesion.usuario
  }

  function cerrarSesion(): void {
    borrarSesion()
    usuario.value = null
  }

  return { usuario, estaAutenticado, esAdmin, iniciarSesion, cerrarSesion }
}
