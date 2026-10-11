import { IsIn, IsOptional } from 'class-validator'

import { TIPOS_TRANSACCION, type TipoTransaccion } from '../entities/categoria.entity.js'

/** Filtros de GET /categorias. Sin tipo, se listan todas. */
export class FiltroCategoriasDto {
  @IsOptional()
  @IsIn(TIPOS_TRANSACCION)
  tipo?: TipoTransaccion
}
