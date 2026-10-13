import type { ReporteGlobal } from '@/interfaces/ReporteInterface'

import { http } from './http'

export class ReporteService {
  /** Pide al back el reporte global del negocio (solo ADMIN). */
  static async obtenerReporte(): Promise<ReporteGlobal> {
    const respuesta = await http.get<ReporteGlobal>('/reporte')
    return respuesta.data
  }
}
