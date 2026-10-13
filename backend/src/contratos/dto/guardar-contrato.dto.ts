import { IsEmail, IsIn, IsInt, IsString, Length, Min } from 'class-validator'

import { EsFecha } from '../../comun/validaciones.js'
import {
  ESTADOS_CONTRATO,
  TIPOS_CONTRATO,
  type EstadoContrato,
  type TipoContrato,
} from '../entities/contrato.entity.js'

/** Sirve para crear y para actualizar un contrato. */
export class GuardarContratoDto {
  @IsInt()
  @Min(1)
  propiedadId: number

  @IsString()
  @Length(2, 100)
  inquilinoNombre: string

  @IsString()
  @Length(3, 30)
  inquilinoDocumento: string

  @IsEmail()
  inquilinoCorreo: string

  // Opcional en la práctica: puede llegar vacío.
  @IsString()
  @Length(0, 30)
  inquilinoTelefono: string

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
