import { Controller, Get, Query } from '@nestjs/common'

import { UsuarioActual } from '../comun/decoradores.js'
import type { UsuarioDelToken } from '../comun/sesion.js'
import { FiltroTableroDto } from './dto/filtro-tablero.dto.js'
import { TableroService } from './tablero.service.js'

@Controller('tablero')
export class TableroController {
  constructor(private readonly tableroService: TableroService) {}

  @Get()
  resumen(@Query() filtros: FiltroTableroDto, @UsuarioActual() usuario: UsuarioDelToken) {
    return this.tableroService.resumen(usuario.sub, filtros)
  }
}
