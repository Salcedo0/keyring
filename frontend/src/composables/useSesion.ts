import { computed, ref } from 'vue'

import type { IngresoDTO } from '@/dtos/IngresoDTO'
import type { RegistroDTO } from '@/dtos/RegistroDTO'
import type { Sesion, Usuario } from '@/interfaces/UsuarioInterface'
import { ingresar, registrarse } from '@/services/AutenticacionService'
import { borrarSesion, guardarSesion, leerSesion } from '@/utils/almacenSesion'

// Vive fuera de la función para que todas las pantallas compartan el mismo usuario.
const usuario = ref<Usuario | null>(leerSesion()?.usuario ?? null)

/** Guarda la sesión que respondió el back y la deja activa en todas las pantallas. */
function activarSesion(sesion: Sesion): void {
  guardarSesion(sesion)
  usuario.value = sesion.usuario
}

/** Usuario actual, su rol y las acciones para entrar, registrarse y salir. */
export function useSesion() {
  const estaAutenticado = computed(() => usuario.value !== null)
  const esAdmin = computed(() => usuario.value?.rol === 'ADMIN')

  async function iniciarSesion(datos: IngresoDTO): Promise<void> {
    activarSesion(await ingresar(datos))
  }

  /** Crea la cuenta y deja la sesión iniciada, sin pedir el login otra vez. */
  async function crearCuenta(datos: RegistroDTO): Promise<void> {
    activarSesion(await registrarse(datos))
  }

  function cerrarSesion(): void {
    borrarSesion()
    usuario.value = null
  }

  return { usuario, estaAutenticado, esAdmin, iniciarSesion, crearCuenta, cerrarSesion }
}
