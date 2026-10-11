import { Type } from 'class-transformer'
import { IsEmail, IsIn, IsInt, IsString, Length, Min, ValidateNested } from 'class-validator'

import { EsFecha } from '../../comun/validaciones.js'
import {
  ESTADOS_CONTRATO,
  TIPOS_CONTRATO,
  type EstadoContrato,
  type TipoContrato,
} from '../entities/contrato.entity.js'

export class InquilinoDto {
  @IsString()
  @Length(2, 100)
  nombre: string

  @IsString()
  @Length(3, 30)
  documento: string

  @IsEmail()
  correo: string

  // Opcional en la práctica: puede llegar vacío.
  @IsString()
  @Length(0, 30)
  telefono: string
}

/** Sirve para crear y para actualizar un contrato. */
export class GuardarContratoDto {
  @IsInt()
  @Min(1)
  propiedadId: number

  @ValidateNested()
  @Type(() => InquilinoDto)
  inquilino: InquilinoDto

  @IsIn(TIPOS_CONTRATO)
  tipo: TipoContrato

  @EsFecha()
  fechaInicio: string

  @EsFecha()
  fechaFin: string

  @IsInt()
  @Min(1)
  valor: number

  @IsIn(ESTADOS_CONTRATO)
  estado: EstadoContrato
}
