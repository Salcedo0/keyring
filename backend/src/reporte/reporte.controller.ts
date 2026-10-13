import { Controller, Get } from '@nestjs/common';

import { SoloAdmin } from '../comun/decoradores.js';
import { ReporteService, type ReporteGlobal } from './reporte.service.js';

@SoloAdmin()
@Controller('reporte')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get()
  generar(): Promise<ReporteGlobal> {
    return this.reporteService.generar();
  }
}
