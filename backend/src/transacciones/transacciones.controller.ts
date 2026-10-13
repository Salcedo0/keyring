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
  Query,
} from '@nestjs/common'

import { UsuarioActual } from '../comun/decoradores.js'
import type { UsuarioDelToken } from '../comun/sesion.js'
import { FiltroTransaccionesDto } from './dto/filtro-transacciones.dto.js'
import { GuardarTransaccionDto } from './dto/guardar-transaccion.dto.js'
import { CATEGORIAS, type OpcionCategoria } from './entities/transaccion.entity.js'
import {
  TransaccionesService,
  type TotalCategoria,
  type TransaccionRespuesta,
} from './transacciones.service.js'

@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Get()
  listar(
    @Query() filtros: FiltroTransaccionesDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<TransaccionRespuesta[]> {
    return this.transaccionesService.listar(usuario.sub, filtros)
  }

  // Las dos rutas que siguen van antes de ':id' para que su nombre no se lea como un id.

  /** La lista fija de categorías, para los selectores del front. */
  @Get('categorias')
  listarCategorias(): OpcionCategoria[] {
    return CATEGORIAS
  }

  @Get('resumen-por-categoria')
  resumenPorCategoria(
    @Query() filtros: FiltroTransaccionesDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<TotalCategoria[]> {
    return this.transaccionesService.resumenPorCategoria(usuario.sub, filtros)
  }

  @Get(':id')
  buscar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<TransaccionRespuesta> {
    return this.transaccionesService.buscar(id, usuario.sub)
  }

  @Post()
  crear(
    @Body() datos: GuardarTransaccionDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<TransaccionRespuesta> {
    return this.transaccionesService.crear(datos, usuario.sub)
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: GuardarTransaccionDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<TransaccionRespuesta> {
    return this.transaccionesService.actualizar(id, datos, usuario.sub)
  }

  @Delete(':id')
  @HttpCode(204)
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<void> {
    return this.transaccionesService.eliminar(id, usuario.sub)
  }
}
