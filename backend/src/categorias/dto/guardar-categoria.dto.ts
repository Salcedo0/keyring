import { IsIn, IsString, Length } from 'class-validator'

import { TIPOS_TRANSACCION, type TipoTransaccion } from '../entities/categoria.entity.js'

/** Sirve para crear y para actualizar una categoría. */
export class GuardarCategoriaDto {
  @IsString()
  @Length(2, 60)
  nombre: string

  @IsIn(TIPOS_TRANSACCION)
  tipo: TipoTransaccion
}
