import { IsIn, IsInt, IsOptional, IsString, Length, Min } from 'class-validator'

import { EsFecha } from '../../comun/validaciones.js'
import {
  NOMBRES_CATEGORIAS,
  TIPOS_TRANSACCION,
  type TipoTransaccion,
} from '../entities/transaccion.entity.js'

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

  @IsIn(NOMBRES_CATEGORIAS)
  categoria: string

  @IsInt()
  @Min(1)
  monto: number

  @EsFecha()
  fecha: string

  @IsString()
  @Length(0, 200)
  descripcion: string
}
