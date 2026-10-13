import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

import { ESTADOS_CONTRATO, type EstadoContrato } from '../entities/contrato.entity.js';

/** Filtros de GET /contratos. Un filtro que no llega significa "todos". */
export class FiltroContratosDto {
  // Todo lo que viene en la URL es texto; @Type lo convierte a número antes de validarlo.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  propiedadId?: number;

  @IsOptional()
  @IsIn(ESTADOS_CONTRATO)
  estado?: EstadoContrato;
}
