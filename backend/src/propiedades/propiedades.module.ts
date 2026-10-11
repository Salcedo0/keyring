import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Contrato } from '../contratos/entities/contrato.entity.js'
import { Transaccion } from '../transacciones/entities/transaccion.entity.js'
import { Propiedad } from './entities/propiedad.entity.js'
import { PropiedadesController } from './propiedades.controller.js'
import { PropiedadesService } from './propiedades.service.js'

@Module({
  // Contrato y Transaccion se usan solo para saber si una propiedad tiene historial antes de eliminarla.
  imports: [TypeOrmModule.forFeature([Propiedad, Contrato, Transaccion])],
  controllers: [PropiedadesController],
  providers: [PropiedadesService],
  // Contratos y transacciones lo usan para comprobar que la propiedad es del usuario.
  exports: [PropiedadesService],
})
export class PropiedadesModule {}
