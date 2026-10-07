import type { Sesion } from '@/interfaces/UsuarioInterface'

/*
 * Guarda la sesión en el navegador para que no se pierda al recargar la página.
 * Es el único uso permitido de localStorage en el proyecto (ver GUIA-DE-CODIGO.md, sección 4).
 */
const CLAVE_SESION = 'keyring.sesion'

/** Devuelve la sesión guardada, o null si no hay una (o si está dañada). */
export function leerSesion(): Sesion | null {
  const texto = localStorage.getItem(CLAVE_SESION)
  if (!texto) return null
  try {
    return JSON.parse(texto) as Sesion
  } catch {
    return null
  }
}

/** Guarda la sesión que respondió el back al iniciar sesión. */
export function guardarSesion(sesion: Sesion): void {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
}

/** Borra la sesión guardada. */
export function borrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION)
}
