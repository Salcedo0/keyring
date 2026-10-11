import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoriasModule } from '../categorias/categorias.module.js'
import { Contrato } from '../contratos/entities/contrato.entity.js'
import { PropiedadesModule } from '../propiedades/propiedades.module.js'
import { Transaccion } from './entities/transaccion.entity.js'
import { TransaccionesController } from './transacciones.controller.js'
import { TransaccionesService } from './transacciones.service.js'

@Module({
  // Contrato se usa solo para revisar que el contrato elegido sea de la misma propiedad.
  imports: [TypeOrmModule.forFeature([Transaccion, Contrato]), PropiedadesModule, CategoriasModule],
  controllers: [TransaccionesController],
  providers: [TransaccionesService],
  // El tablero lo usa para leer las transacciones del periodo.
  exports: [TransaccionesService],
})
export class TransaccionesModule {}
