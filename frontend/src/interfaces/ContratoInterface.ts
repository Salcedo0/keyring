export type TipoContrato = 'CORTA' | 'FIJA'

export type EstadoContrato = 'ACTIVO' | 'PENDIENTE' | 'FINALIZADO' | 'CANCELADO'

export interface ContratoInterface {
  id: number
  propiedadId: number
  propiedadNombre: string
  inquilinoNombre: string
  inquilinoDocumento: string
  inquilinoCorreo: string
  inquilinoTelefono: string
  tipo: TipoContrato
  /** Formato AAAA-MM-DD. */
  fechaInicio: string
  /** Formato AAAA-MM-DD. */
  fechaFin: string
  /** Total de la estadía, o canon mensual si el contrato es FIJA. */
  valor: number
  estado: EstadoContrato
}

/** Filtros de la lista de contratos. Un filtro vacío significa "todos". */
export interface FiltrosContratos {
  propiedadId: number | null
  estado: EstadoContrato | null
}
