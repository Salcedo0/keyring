import { IsIn, IsNumber, IsString, Length, Max, Min } from 'class-validator'

import {
  MODALIDADES,
  TIPOS_PROPIEDAD,
  type Modalidad,
  type TipoPropiedad,
} from '../entities/propiedad.entity.js'

/** Sirve para crear y para actualizar una propiedad. El dueño sale del token, no del cuerpo. */
export class GuardarPropiedadDto {
  @IsString()
  @Length(2, 100)
  nombre: string

  @IsString()
  @Length(3, 200)
  direccion: string

  @IsString()
  @Length(2, 100)
  ciudad: string

  @IsIn(TIPOS_PROPIEDAD)
  tipo: TipoPropiedad

  @IsIn(MODALIDADES)
  modalidad: Modalidad

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitud: number

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitud: number
}
