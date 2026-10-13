import { IsIn, IsOptional } from 'class-validator';

import { ROLES, type Rol } from '../entities/usuario.entity.js';

/** Filtros de GET /usuarios. Sin rol, se listan todos. */
export class FiltroUsuariosDto {
  @IsOptional()
  @IsIn(ROLES)
  rol?: Rol;
}
