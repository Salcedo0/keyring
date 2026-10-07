import type { GuardarContratoDTO } from '@/dtos/GuardarContratoDTO'
import type { Contrato, FiltrosContratos } from '@/interfaces/ContratoInterface'

import { http } from './http'

/** Lista los contratos. Los filtros en null no se envían (el back devuelve todos). */
export async function obtenerContratos(filtros?: Partial<FiltrosContratos>): Promise<Contrato[]> {
  const respuesta = await http.get<Contrato[]>('/contratos', { params: filtros })
  return respuesta.data
}

/** Trae un contrato por su id. */
export async function obtenerContrato(id: number): Promise<Contrato> {
  const respuesta = await http.get<Contrato>(`/contratos/${id}`)
  return respuesta.data
}

/** Crea un contrato nuevo. */
export async function crearContrato(datos: GuardarContratoDTO): Promise<Contrato> {
  const respuesta = await http.post<Contrato>('/contratos', datos)
  return respuesta.data
}

/** Reemplaza los datos de un contrato existente. */
export async function actualizarContrato(id: number, datos: GuardarContratoDTO): Promise<Contrato> {
  const respuesta = await http.put<Contrato>(`/contratos/${id}`, datos)
  return respuesta.data
}

/** Elimina un contrato. */
export async function eliminarContrato(id: number): Promise<void> {
  await http.delete(`/contratos/${id}`)
}
