import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'

import { UsuarioActual } from '../comun/decoradores.js'
import type { UsuarioDelToken } from '../comun/sesion.js'
import { GuardarPropiedadDto } from './dto/guardar-propiedad.dto.js'
import type { Propiedad } from './entities/propiedad.entity.js'
import { PropiedadesService } from './propiedades.service.js'

@Controller('propiedades')
export class PropiedadesController {
  constructor(private readonly propiedadesService: PropiedadesService) {}

  @Get()
  listar(@UsuarioActual() usuario: UsuarioDelToken): Promise<Propiedad[]> {
    return this.propiedadesService.listar(usuario.sub)
  }

  @Get(':id')
  buscar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<Propiedad> {
    return this.propiedadesService.buscar(id, usuario.sub)
  }

  @Post()
  crear(
    @Body() datos: GuardarPropiedadDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<Propiedad> {
    return this.propiedadesService.crear(datos, usuario.sub)
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: GuardarPropiedadDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<Propiedad> {
    return this.propiedadesService.actualizar(id, datos, usuario.sub)
  }

  @Delete(':id')
  @HttpCode(204)
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<void> {
    return this.propiedadesService.eliminar(id, usuario.sub)
  }
}
