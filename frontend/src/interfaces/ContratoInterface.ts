export type TipoContrato = 'CORTA' | 'FIJA'

export type EstadoContrato = 'ACTIVO' | 'PENDIENTE' | 'FINALIZADO' | 'CANCELADO'

export interface Inquilino {
  nombre: string
  documento: string
  correo: string
  telefono: string
}

export interface Contrato {
  id: number
  propiedadId: number
  propiedadNombre: string
  inquilino: Inquilino
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
