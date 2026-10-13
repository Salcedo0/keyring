export type TipoTransaccion = 'INGRESO' | 'GASTO';

export interface TransaccionInterface {
  id: number;
  propiedadId: number;
  propiedadNombre: string;
  contratoId: number | null;
  tipo: TipoTransaccion;
  /** Uno de los nombres de la lista fija de categorías. */
  categoria: string;
  /** Siempre positivo: el tipo dice si es ingreso o gasto. */
  monto: number;
  /** Formato AAAA-MM-DD. */
  fecha: string;
  descripcion: string;
}

/** Filtros de la lista de transacciones. Un filtro vacío significa "todos". */
export interface FiltrosTransacciones {
  propiedadId: number | null;
  tipo: TipoTransaccion | null;
  categoria: string | null;
  /** Formato AAAA-MM. */
  mes: string;
}

/** Una categoría de la lista fija del back. Solo se usa para los selectores. */
export interface Categoria {
  nombre: string;
  tipo: TipoTransaccion;
}

/** Total de una categoría. Lo calcula el back con los mismos filtros de la lista. */
export interface ResumenCategoria {
  categoria: string;
  tipo: TipoTransaccion;
  total: number;
}
