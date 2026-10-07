const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Verdadero si el texto está vacío o solo tiene espacios. */
export function estaVacio(texto: string | null | undefined): boolean {
  return !texto || texto.trim() === ''
}

/** Verdadero si el texto tiene forma de correo (nombre@dominio.algo). */
export function esCorreoValido(correo: string): boolean {
  return PATRON_CORREO.test(correo.trim())
}

/** Verdadero si algún campo del objeto de errores tiene un mensaje. */
export function hayErrores(errores: Record<string, string>): boolean {
  return Object.values(errores).some((mensaje) => mensaje !== '')
}
