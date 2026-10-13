import { IsEmail, IsString, Length } from 'class-validator';

export class RegistrarseDto {
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsEmail()
  correo: string;

  // Mínimo 8 caracteres: lo básico para que una contraseña no sea trivial de adivinar.
  @IsString()
  @Length(8, 100)
  contrasena: string;
}
