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
} from '@nestjs/common';

import { UsuarioActual } from '../comun/decoradores.js';
import type { UsuarioDelToken } from '../comun/sesion.js';
import { ContratosService, type ContratoRespuesta } from './contratos.service.js';
import { FiltroContratosDto } from './dto/filtro-contratos.dto.js';
import { GuardarContratoDto } from './dto/guardar-contrato.dto.js';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Get()
  listar(
    @Query() filtros: FiltroContratosDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<ContratoRespuesta[]> {
    return this.contratosService.listar(usuario.sub, filtros);
  }

  @Get(':id')
  buscar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<ContratoRespuesta> {
    return this.contratosService.buscar(id, usuario.sub);
  }

  @Post()
  crear(
    @Body() datos: GuardarContratoDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<ContratoRespuesta> {
    return this.contratosService.crear(datos, usuario.sub);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: GuardarContratoDto,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<ContratoRespuesta> {
    return this.contratosService.actualizar(id, datos, usuario.sub);
  }

  @Delete(':id')
  @HttpCode(204)
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioDelToken,
  ): Promise<void> {
    return this.contratosService.eliminar(id, usuario.sub);
  }
}
