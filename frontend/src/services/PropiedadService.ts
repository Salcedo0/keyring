import type { GuardarPropiedadDTO } from '@/dtos/GuardarPropiedadDTO';
import type { PropiedadInterface } from '@/interfaces/PropiedadInterface';

import { http } from './http';

export class PropiedadService {
  /** Lista las propiedades del usuario que inició sesión. */
  static async obtenerPropiedades(): Promise<PropiedadInterface[]> {
    const respuesta = await http.get<PropiedadInterface[]>('/propiedades');
    return respuesta.data;
  }

  static async obtenerPropiedad(id: number): Promise<PropiedadInterface> {
    const respuesta = await http.get<PropiedadInterface>(`/propiedades/${id}`);
    return respuesta.data;
  }

  static async crearPropiedad(datos: GuardarPropiedadDTO): Promise<PropiedadInterface> {
    const respuesta = await http.post<PropiedadInterface>('/propiedades', datos);
    return respuesta.data;
  }

  static async actualizarPropiedad(
    id: number,
    datos: GuardarPropiedadDTO,
  ): Promise<PropiedadInterface> {
    const respuesta = await http.put<PropiedadInterface>(`/propiedades/${id}`, datos);
    return respuesta.data;
  }

  static async eliminarPropiedad(id: number): Promise<void> {
    await http.delete(`/propiedades/${id}`);
  }
}
