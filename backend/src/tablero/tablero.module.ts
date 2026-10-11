import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Contrato } from '../contratos/entities/contrato.entity.js'
import { TransaccionesModule } from '../transacciones/transacciones.module.js'
import { TableroController } from './tablero.controller.js'
import { TableroService } from './tablero.service.js'

@Module({
  // Contrato se usa solo para contar los contratos activos.
  imports: [TypeOrmModule.forFeature([Contrato]), TransaccionesModule],
  controllers: [TableroController],
  providers: [TableroService],
})
export class TableroModule {}
