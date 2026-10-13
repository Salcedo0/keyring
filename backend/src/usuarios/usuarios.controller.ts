import { Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Query } from '@nestjs/common';

import { SoloAdmin, UsuarioActual } from '../comun/decoradores.js';
import type { UsuarioDelToken } from '../comun/sesion.js';
import { FiltroUsuariosDto } from './dto/filtro-usuarios.dto.js';
import type { Usuario } from './entities/usuario.entity.js';
import { UsuariosService, type ResumenRol } from './usuarios.service.js';

@SoloAdmin()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  listar(@Query() filtros: FiltroUsuariosDto): Promise<Usuario[]> {
    return this.usuariosService.listar(filtros.rol);
  }

  @Get('resumen-por-rol')
  resumenPorRol(): Promise<ResumenRol[]> {
    return this.usuariosService.resumenPorRol();
  }

  @Delete(':id')
  @HttpCode(204)
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<void> {
    return this.usuariosService.eliminar(id, usuario.sub);
  }
}
