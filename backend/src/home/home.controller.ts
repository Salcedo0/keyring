import { Controller, Get } from '@nestjs/common';

import { Publica } from '../comun/decoradores.js';
import { HomeService, type EstadoApi } from './home.service.js';

// Sin ruta propia: con el prefijo global queda en GET /api, lo primero que se abre en el navegador.
@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Publica()
  @Get()
  estado(): EstadoApi {
    return this.homeService.estado();
  }
}
