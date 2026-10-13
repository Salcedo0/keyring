import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AutenticacionModule } from './autenticacion/autenticacion.module.js';
import { AutenticacionGuard } from './comun/autenticacion.guard.js';
import { ContratosModule } from './contratos/contratos.module.js';
import { opcionesBaseDeDatos } from './data-source.js';
import { variableObligatoria } from './entorno.js';
import { HomeModule } from './home/home.module.js';
import { PropiedadesModule } from './propiedades/propiedades.module.js';
import { ReporteModule } from './reporte/reporte.module.js';
import { TableroModule } from './tablero/tablero.module.js';
import { TransaccionesModule } from './transacciones/transacciones.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';

@Module({
  imports: [
    // Al arrancar aplica las migraciones que falten, así la base siempre queda al día con el código.
    TypeOrmModule.forRoot({ ...opcionesBaseDeDatos, migrationsRun: true }),
    // global: cualquier módulo puede firmar o verificar tokens sin volver a configurarlo.
    JwtModule.register({
      global: true,
      secret: variableObligatoria('JWT_SECRETO'),
      signOptions: { expiresIn: '8h' },
    }),
    HomeModule,
    AutenticacionModule,
    UsuariosModule,
    PropiedadesModule,
    ContratosModule,
    TransaccionesModule,
    TableroModule,
    ReporteModule,
  ],
  // El guard protege TODAS las rutas. Las públicas (login, registro) se marcan con @Publica().
  providers: [{ provide: APP_GUARD, useClass: AutenticacionGuard }],
})
export class AppModule {}
