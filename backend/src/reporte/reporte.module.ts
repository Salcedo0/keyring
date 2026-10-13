import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Contrato } from '../contratos/entities/contrato.entity.js'
import { Propiedad } from '../propiedades/entities/propiedad.entity.js'
import { Transaccion } from '../transacciones/entities/transaccion.entity.js'
import { UsuariosModule } from '../usuarios/usuarios.module.js'
import { ReporteController } from './reporte.controller.js'
import { ReporteService } from './reporte.service.js'

@Module({
  // Solo lee: cuenta propiedades y contratos activos, y suma las transacciones de cada propietario.
  imports: [TypeOrmModule.forFeature([Propiedad, Contrato, Transaccion]), UsuariosModule],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}
