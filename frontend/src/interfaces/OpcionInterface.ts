/** Una opción de un selector o de un grupo de opciones. `valor` null significa "todos" o "ninguno". */
export interface Opcion<T = string | number | null> {
  valor: T
  texto: string
}

/** Una columna de la tabla de datos. `clave` es el campo de la fila que se muestra. */
export interface Columna {
  clave: string
  titulo: string
  alineacion?: 'izquierda' | 'derecha'
}
