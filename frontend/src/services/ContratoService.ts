import type { GuardarContratoDTO } from '@/dtos/GuardarContratoDTO';
import type { ContratoInterface, FiltrosContratos } from '@/interfaces/ContratoInterface';

import { http } from './http';

export class ContratoService {
  /** Lista los contratos. Los filtros en null no se envían (el back devuelve todos). */
  static async obtenerContratos(filtros?: Partial<FiltrosContratos>): Promise<ContratoInterface[]> {
    const respuesta = await http.get<ContratoInterface[]>('/contratos', { params: filtros });
    return respuesta.data;
  }

  static async obtenerContrato(id: number): Promise<ContratoInterface> {
    const respuesta = await http.get<ContratoInterface>(`/contratos/${id}`);
    return respuesta.data;
  }

  static async crearContrato(datos: GuardarContratoDTO): Promise<ContratoInterface> {
    const respuesta = await http.post<ContratoInterface>('/contratos', datos);
    return respuesta.data;
  }

  static async actualizarContrato(
    id: number,
    datos: GuardarContratoDTO,
  ): Promise<ContratoInterface> {
    const respuesta = await http.put<ContratoInterface>(`/contratos/${id}`, datos);
    return respuesta.data;
  }

  static async eliminarContrato(id: number): Promise<void> {
    await http.delete(`/contratos/${id}`);
  }
}
