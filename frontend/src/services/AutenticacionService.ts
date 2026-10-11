import type { IngresoDTO } from '@/dtos/IngresoDTO'
import type { RegistroDTO } from '@/dtos/RegistroDTO'
import type { Sesion } from '@/interfaces/UsuarioInterface'

import { http } from './http'

/** Envía correo y contraseña; el back responde con el token y el usuario. */
export async function ingresar(datos: IngresoDTO): Promise<Sesion> {
  const respuesta = await http.post<Sesion>('/auth/ingresar', datos)
  return respuesta.data
}

/** Crea una cuenta de propietario; el back responde igual que al iniciar sesión. */
export async function registrarse(datos: RegistroDTO): Promise<Sesion> {
  const respuesta = await http.post<Sesion>('/auth/registrarse', datos)
  return respuesta.data
}
