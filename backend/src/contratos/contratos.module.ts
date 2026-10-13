import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropiedadesModule } from '../propiedades/propiedades.module.js';
import { ContratosController } from './contratos.controller.js';
import { ContratosService } from './contratos.service.js';
import { Contrato } from './entities/contrato.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contrato]), PropiedadesModule],
  controllers: [ContratosController],
  providers: [ContratosService],
})
export class ContratosModule {}
