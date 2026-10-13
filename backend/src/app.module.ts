import { join } from 'node:path'

import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AutenticacionModule } from './autenticacion/autenticacion.module.js'
import { AutenticacionGuard } from './comun/autenticacion.guard.js'
import { ContratosModule } from './contratos/contratos.module.js'
import { variableObligatoria } from './entorno.js'
import { PropiedadesModule } from './propiedades/propiedades.module.js'
import { TableroModule } from './tablero/tablero.module.js'
import { TransaccionesModule } from './transacciones/transacciones.module.js'
import { UsuariosModule } from './usuarios/usuarios.module.js'

// En Docker la base vive en un volumen (SQLITE_PATH); en local, en backend/database.sqlite.
const rutaBaseDeDatos =
  process.env.SQLITE_PATH ?? join(import.meta.dirname, '..', 'database.sqlite')

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: rutaBaseDeDatos,
      autoLoadEntities: true,
      // Crea y ajusta las tablas a partir de las entidades. No hay migraciones en el proyecto.
      synchronize: true,
      // Un filtro que no se envía llega como undefined y significa "todos": se ignora en el WHERE.
      // (TypeORM 1 lanza un error por defecto.)
      invalidWhereValuesBehavior: { undefined: 'ignore' },
    }),
    // global: cualquier módulo puede firmar o verificar tokens sin volver a configurarlo.
    JwtModule.register({
      global: true,
      secret: variableObligatoria('JWT_SECRETO'),
      signOptions: { expiresIn: '8h' },
    }),
    AutenticacionModule,
    UsuariosModule,
    PropiedadesModule,
    ContratosModule,
    TransaccionesModule,
    TableroModule,
  ],
  // El guard protege TODAS las rutas. Las públicas (login, registro) se marcan con @Publica().
  providers: [{ provide: APP_GUARD, useClass: AutenticacionGuard }],
})
export class AppModule {}
