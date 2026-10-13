import type { ReporteInterface } from '@/interfaces/ReporteInterface';

import { http } from './http';

export class ReporteService {
  /** Pide al back el reporte global del negocio (solo ADMIN). */
  static async obtenerReporte(): Promise<ReporteInterface> {
    const respuesta = await http.get<ReporteInterface>('/reporte');
    return respuesta.data;
  }
}
