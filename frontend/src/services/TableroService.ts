import type { FiltrosTablero, ResumenTablero } from '@/interfaces/TableroInterface'

import { http } from './http'

/** Pide al back los indicadores, gráficos y últimas transacciones del dashboard. */
export async function obtenerResumenTablero(filtros: FiltrosTablero): Promise<ResumenTablero> {
  const respuesta = await http.get<ResumenTablero>('/tablero', { params: filtros })
  return respuesta.data
}
