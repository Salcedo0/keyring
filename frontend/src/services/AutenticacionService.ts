import type { IngresoDTO } from '@/dtos/IngresoDTO'
import type { Sesion } from '@/interfaces/UsuarioInterface'

import { http } from './http'

/** Envía correo y contraseña; el back responde con el token y el usuario. */
export async function ingresar(datos: IngresoDTO): Promise<Sesion> {
  const respuesta = await http.post<Sesion>('/auth/ingresar', datos)
  return respuesta.data
}
