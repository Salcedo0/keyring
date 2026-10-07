import type { GuardarPropiedadDTO } from '@/dtos/GuardarPropiedadDTO'
import type { Propiedad } from '@/interfaces/PropiedadInterface'

import { http } from './http'

/** Lista las propiedades del usuario que inició sesión. */
export async function obtenerPropiedades(): Promise<Propiedad[]> {
  const respuesta = await http.get<Propiedad[]>('/propiedades')
  return respuesta.data
}

/** Trae una propiedad por su id. */
export async function obtenerPropiedad(id: number): Promise<Propiedad> {
  const respuesta = await http.get<Propiedad>(`/propiedades/${id}`)
  return respuesta.data
}

/** Crea una propiedad nueva. */
export async function crearPropiedad(datos: GuardarPropiedadDTO): Promise<Propiedad> {
  const respuesta = await http.post<Propiedad>('/propiedades', datos)
  return respuesta.data
}

/** Reemplaza los datos de una propiedad existente. */
export async function actualizarPropiedad(
  id: number,
  datos: GuardarPropiedadDTO,
): Promise<Propiedad> {
  const respuesta = await http.put<Propiedad>(`/propiedades/${id}`, datos)
  return respuesta.data
}

/** Elimina una propiedad. */
export async function eliminarPropiedad(id: number): Promise<void> {
  await http.delete(`/propiedades/${id}`)
}
