import { Injectable } from '@nestjs/common';

/** Lo que responde GET /api: sirve para comprobar que la API está corriendo. */
export interface EstadoApi {
  nombre: string;
  estado: 'ok';
}

@Injectable()
export class HomeService {
  estado(): EstadoApi {
    return { nombre: 'KeyRing API', estado: 'ok' };
  }
}
