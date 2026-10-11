import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional } from 'class-validator'

import {
  TIPOS_TRANSACCION,
  type TipoTransaccion,
} from '../../categorias/entities/categoria.entity.js'
import { EsMes } from '../../comun/validaciones.js'

/** Filtros de GET /transacciones y de su resumen por categoría. Sin filtro = "todos". */
export class FiltroTransaccionesDto {
  // Todo lo que viene en la URL es texto; @Type lo convierte a número antes de validarlo.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  propiedadId?: number

  @IsOptional()
  @IsIn(TIPOS_TRANSACCION)
  tipo?: TipoTransaccion

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoriaId?: number

  /** Formato AAAA-MM. */
  @IsOptional()
  @EsMes()
  mes?: string
}
