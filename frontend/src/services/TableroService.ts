import type { FiltrosTablero, TableroInterface } from '@/interfaces/TableroInterface'

import { http } from './http'

export class TableroService {
  /** Pide al back los indicadores, gráficos y últimas transacciones del dashboard. */
  static async obtenerResumenTablero(filtros: FiltrosTablero): Promise<TableroInterface> {
    const respuesta = await http.get<TableroInterface>('/tablero', { params: filtros })
    return respuesta.data
  }
}
