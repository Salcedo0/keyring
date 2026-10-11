import { IsIn, IsInt, IsOptional, IsString, Length, Min } from 'class-validator'

import {
  TIPOS_TRANSACCION,
  type TipoTransaccion,
} from '../../categorias/entities/categoria.entity.js'
import { EsFecha } from '../../comun/validaciones.js'

/** Sirve para crear y para actualizar una transacción. */
export class GuardarTransaccionDto {
  @IsInt()
  @Min(1)
  propiedadId: number

  // null = la transacción no está ligada a ningún contrato.
  @IsOptional()
  @IsInt()
  contratoId: number | null

  @IsIn(TIPOS_TRANSACCION)
  tipo: TipoTransaccion

  @IsInt()
  @Min(1)
  categoriaId: number

  @IsInt()
  @Min(1)
  monto: number

  @EsFecha()
  fecha: string

  @IsString()
  @Length(0, 200)
  descripcion: string
}
