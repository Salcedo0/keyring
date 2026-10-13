import type { GuardarPropiedadDTO } from '@/dtos/GuardarPropiedadDTO'
import type { Propiedad } from '@/interfaces/PropiedadInterface'

import { http } from './http'

export class PropiedadService {
  /** Lista las propiedades del usuario que inició sesión. */
  static async obtenerPropiedades(): Promise<Propiedad[]> {
    const respuesta = await http.get<Propiedad[]>('/propiedades')
    return respuesta.data
  }

  /** Trae una propiedad por su id. */
  static async obtenerPropiedad(id: number): Promise<Propiedad> {
    const respuesta = await http.get<Propiedad>(`/propiedades/${id}`)
    return respuesta.data
  }

  /** Crea una propiedad nueva. */
  static async crearPropiedad(datos: GuardarPropiedadDTO): Promise<Propiedad> {
    const respuesta = await http.post<Propiedad>('/propiedades', datos)
    return respuesta.data
  }

  /** Reemplaza los datos de una propiedad existente. */
  static async actualizarPropiedad(id: number, datos: GuardarPropiedadDTO): Promise<Propiedad> {
    const respuesta = await http.put<Propiedad>(`/propiedades/${id}`, datos)
    return respuesta.data
  }

  /** Elimina una propiedad. */
  static async eliminarPropiedad(id: number): Promise<void> {
    await http.delete(`/propiedades/${id}`)
  }
}
