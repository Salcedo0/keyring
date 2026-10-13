import type { GuardarTransaccionDTO } from '@/dtos/GuardarTransaccionDTO';
import type {
  Categoria,
  FiltrosTransacciones,
  ResumenCategoria,
  TransaccionInterface,
} from '@/interfaces/TransaccionInterface';

import { http } from './http';

/** Quita el mes cuando está vacío para que no viaje como "mes=" en la URL. */
function aParametros(filtros: FiltrosTransacciones): Omit<FiltrosTransacciones, 'mes'> & {
  mes: string | null;
} {
  return { ...filtros, mes: filtros.mes || null };
}

export class TransaccionService {
  /** Lista las transacciones, de la más reciente a la más antigua. */
  static async obtenerTransacciones(
    filtros: FiltrosTransacciones,
  ): Promise<TransaccionInterface[]> {
    const respuesta = await http.get<TransaccionInterface[]>('/transacciones', {
      params: aParametros(filtros),
    });
    return respuesta.data;
  }

  /** La lista fija de categorías (ingreso y gasto). */
  static async obtenerCategorias(): Promise<Categoria[]> {
    const respuesta = await http.get<Categoria[]>('/transacciones/categorias');
    return respuesta.data;
  }

  /** Total por categoría con los mismos filtros de la lista. Lo calcula el back. */
  static async obtenerResumenPorCategoria(
    filtros: FiltrosTransacciones,
  ): Promise<ResumenCategoria[]> {
    const respuesta = await http.get<ResumenCategoria[]>('/transacciones/resumen-por-categoria', {
      params: aParametros(filtros),
    });
    return respuesta.data;
  }

  /** Trae una transacción por su id. */
  static async obtenerTransaccion(id: number): Promise<TransaccionInterface> {
    const respuesta = await http.get<TransaccionInterface>(`/transacciones/${id}`);
    return respuesta.data;
  }

  /** Crea una transacción nueva. */
  static async crearTransaccion(datos: GuardarTransaccionDTO): Promise<TransaccionInterface> {
    const respuesta = await http.post<TransaccionInterface>('/transacciones', datos);
    return respuesta.data;
  }

  /** Reemplaza los datos de una transacción existente. */
  static async actualizarTransaccion(
    id: number,
    datos: GuardarTransaccionDTO,
  ): Promise<TransaccionInterface> {
    const respuesta = await http.put<TransaccionInterface>(`/transacciones/${id}`, datos);
    return respuesta.data;
  }

  /** Elimina una transacción. */
  static async eliminarTransaccion(id: number): Promise<void> {
    await http.delete(`/transacciones/${id}`);
  }
}
