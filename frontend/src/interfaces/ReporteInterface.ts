/** Los números del negocio de un propietario. Los calcula el back. */
export interface FilaReporte {
  /** Id del propietario. */
  id: number
  nombre: string
  correo: string
  propiedades: number
  contratosActivos: number
  ingresos: number
  gastos: number
  utilidad: number
}

/** Lo que muestra la página de administración "Reporte global". */
export interface ReporteGlobal {
  totales: Omit<FilaReporte, 'id' | 'nombre' | 'correo'>
  propietarios: FilaReporte[]
}
