import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Transaccion } from '../transacciones/entities/transaccion.entity.js'
import { CategoriasController } from './categorias.controller.js'
import { CategoriasService } from './categorias.service.js'
import { Categoria } from './entities/categoria.entity.js'

@Module({
  // Transaccion se usa solo para saber si una categoría está en uso antes de eliminarla.
  imports: [TypeOrmModule.forFeature([Categoria, Transaccion])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
