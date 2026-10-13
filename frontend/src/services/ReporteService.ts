import type { ReporteGlobal } from '@/interfaces/ReporteInterface'

import { http } from './http'

/** Pide al back el reporte global del negocio (solo ADMIN). */
export async function obtenerReporte(): Promise<ReporteGlobal> {
  const respuesta = await http.get<ReporteGlobal>('/reporte')
  return respuesta.data
}
