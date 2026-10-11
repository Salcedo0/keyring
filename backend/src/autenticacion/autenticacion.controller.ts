import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { Publica } from '../comun/decoradores.js'
import { AutenticacionService, type Sesion } from './autenticacion.service.js'
import { IngresarDto } from './dto/ingresar.dto.js'
import { RegistrarseDto } from './dto/registrarse.dto.js'

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Publica()
  @Post('ingresar')
  @HttpCode(200)
  ingresar(@Body() datos: IngresarDto): Promise<Sesion> {
    return this.autenticacionService.ingresar(datos)
  }

  @Publica()
  @Post('registrarse')
  registrarse(@Body() datos: RegistrarseDto): Promise<Sesion> {
    return this.autenticacionService.registrarse(datos)
  }
}
