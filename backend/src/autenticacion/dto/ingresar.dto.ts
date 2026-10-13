import { IsEmail, IsString, Length } from 'class-validator';

export class IngresarDto {
  @IsEmail()
  correo: string;

  @IsString()
  @Length(1, 100)
  contrasena: string;
}
