export type TipoTransaccion = 'INGRESO' | 'GASTO'

export interface Transaccion {
  id: number
  propiedadId: number
  propiedadNombre: string
  contratoId: number | null
  tipo: TipoTransaccion
  categoriaId: number
  categoriaNombre: string
  /** Siempre positivo: el tipo dice si es ingreso o gasto. */
  monto: number
  /** Formato AAAA-MM-DD. */
  fecha: string
  descripcion: string
}

/** Filtros de la lista de transacciones. Un filtro vacío significa "todos". */
export interface FiltrosTransacciones {
  propiedadId: number | null
  tipo: TipoTransaccion | null
  categoriaId: number | null
  /** Formato AAAA-MM. */
  mes: string
}

/** Total de una categoría. Lo calcula el back con los mismos filtros de la lista. */
export interface ResumenCategoria {
  categoria: string
  tipo: TipoTransaccion
  total: number
}
