import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

import { EsMes } from '../../comun/validaciones.js';
import {
  NOMBRES_CATEGORIAS,
  TIPOS_TRANSACCION,
  type TipoTransaccion,
} from '../entities/transaccion.entity.js';

/** Filtros de GET /transacciones y de su resumen por categoría. Sin filtro = "todos". */
export class FiltroTransaccionesDto {
  // Todo lo que viene en la URL es texto; @Type lo convierte a número antes de validarlo.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  propiedadId?: number;

  @IsOptional()
  @IsIn(TIPOS_TRANSACCION)
  tipo?: TipoTransaccion;

  @IsOptional()
  @IsIn(NOMBRES_CATEGORIAS)
  categoria?: string;

  /** Formato AAAA-MM. */
  @IsOptional()
  @EsMes()
  mes?: string;
}
