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

import { SoloAdmin } from '../comun/decoradores.js'
import { CategoriasService } from './categorias.service.js'
import { FiltroCategoriasDto } from './dto/filtro-categorias.dto.js'
import { GuardarCategoriaDto } from './dto/guardar-categoria.dto.js'
import type { Categoria } from './entities/categoria.entity.js'

// Todos pueden ver las categorías (las necesitan para registrar transacciones);
// solo un ADMIN puede crearlas, cambiarlas o eliminarlas.
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  listar(@Query() filtros: FiltroCategoriasDto): Promise<Categoria[]> {
    return this.categoriasService.listar(filtros.tipo)
  }

  @SoloAdmin()
  @Post()
  crear(@Body() datos: GuardarCategoriaDto): Promise<Categoria> {
    return this.categoriasService.crear(datos)
  }

  @SoloAdmin()
  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: GuardarCategoriaDto,
  ): Promise<Categoria> {
    return this.categoriasService.actualizar(id, datos)
  }

  @SoloAdmin()
  @Delete(':id')
  @HttpCode(204)
  eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriasService.eliminar(id)
  }
}
