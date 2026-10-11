import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

import { EsFecha } from '../../comun/validaciones.js'

/** Filtros de GET /tablero. El rango de fechas es obligatorio; la propiedad, opcional. */
export class FiltroTableroDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  propiedadId?: number

  @EsFecha()
  desde: string

  @EsFecha()
  hasta: string
}
