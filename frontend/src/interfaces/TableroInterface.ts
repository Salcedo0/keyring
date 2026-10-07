import type { Transaccion } from './TransaccionInterface'

/** Filtros del dashboard. Las fechas van en formato AAAA-MM-DD. */
export interface FiltrosTablero {
  propiedadId: number | null
  desde: string
  hasta: string
}

export interface Indicadores {
  ingresos: number
  gastos: number
  utilidadNeta: number
  contratosActivos: number
}

export interface TotalMes {
  /** Formato AAAA-MM. */
  mes: string
  ingresos: number
  gastos: number
}

export interface TotalCategoria {
  categoria: string
  total: number
}

/** Todo lo que muestra el dashboard. Los cálculos los hace el back. */
export interface ResumenTablero {
  indicadores: Indicadores
  porMes: TotalMes[]
  gastosPorCategoria: TotalCategoria[]
  ultimasTransacciones: Transaccion[]
}
