import type { GuardarTransaccionDTO } from '@/dtos/GuardarTransaccionDTO'
import type {
  Categoria,
  FiltrosTransacciones,
  ResumenCategoria,
  Transaccion,
} from '@/interfaces/TransaccionInterface'

import { http } from './http'

/** Quita el mes cuando está vacío para que no viaje como "mes=" en la URL. */
function aParametros(filtros: FiltrosTransacciones): Omit<FiltrosTransacciones, 'mes'> & {
  mes: string | null
} {
  return { ...filtros, mes: filtros.mes || null }
}

/** Lista las transacciones, de la más reciente a la más antigua. */
export async function obtenerTransacciones(filtros: FiltrosTransacciones): Promise<Transaccion[]> {
  const respuesta = await http.get<Transaccion[]>('/transacciones', {
    params: aParametros(filtros),
  })
  return respuesta.data
}

/** La lista fija de categorías (ingreso y gasto). */
export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await http.get<Categoria[]>('/transacciones/categorias')
  return respuesta.data
}

/** Total por categoría con los mismos filtros de la lista. Lo calcula el back. */
export async function obtenerResumenPorCategoria(
  filtros: FiltrosTransacciones,
): Promise<ResumenCategoria[]> {
  const respuesta = await http.get<ResumenCategoria[]>('/transacciones/resumen-por-categoria', {
    params: aParametros(filtros),
  })
  return respuesta.data
}

/** Trae una transacción por su id. */
export async function obtenerTransaccion(id: number): Promise<Transaccion> {
  const respuesta = await http.get<Transaccion>(`/transacciones/${id}`)
  return respuesta.data
}

/** Crea una transacción nueva. */
export async function crearTransaccion(datos: GuardarTransaccionDTO): Promise<Transaccion> {
  const respuesta = await http.post<Transaccion>('/transacciones', datos)
  return respuesta.data
}

/** Reemplaza los datos de una transacción existente. */
export async function actualizarTransaccion(
  id: number,
  datos: GuardarTransaccionDTO,
): Promise<Transaccion> {
  const respuesta = await http.put<Transaccion>(`/transacciones/${id}`, datos)
  return respuesta.data
}

/** Elimina una transacción. */
export async function eliminarTransaccion(id: number): Promise<void> {
  await http.delete(`/transacciones/${id}`)
}
