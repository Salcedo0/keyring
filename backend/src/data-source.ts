import './entorno.js'

import { join } from 'node:path'

import { DataSource, type DataSourceOptions } from 'typeorm'

import { Contrato } from './contratos/entities/contrato.entity.js'
import { Propiedad } from './propiedades/entities/propiedad.entity.js'
import { Transaccion } from './transacciones/entities/transaccion.entity.js'
import { Usuario } from './usuarios/entities/usuario.entity.js'

// En Docker la base vive en un volumen (SQLITE_PATH); en local, en backend/database.sqlite.
const rutaBaseDeDatos =
  process.env.SQLITE_PATH ?? join(import.meta.dirname, '..', 'database.sqlite')

// TypeORM solo entiende "/" en los patrones de archivos, también en Windows.
const carpetaMigraciones = join(import.meta.dirname, 'migrations').replaceAll('\\', '/')

/** Configuración de la base que comparten la API (app.module.ts) y el CLI de migraciones. */
export const opcionesBaseDeDatos: DataSourceOptions = {
  type: 'better-sqlite3',
  database: rutaBaseDeDatos,
  entities: [Usuario, Propiedad, Contrato, Transaccion],
  migrations: [`${carpetaMigraciones}/*.js`],
  // El esquema solo cambia con migraciones, nunca se ajusta solo al arrancar.
  synchronize: false,
  // Un filtro que no se envía llega como undefined y significa "todos": se ignora en el WHERE.
  // (TypeORM 1 lanza un error por defecto.)
  invalidWhereValuesBehavior: { undefined: 'ignore' },
}

// Lo usa el CLI de TypeORM: npm run migration:generate, migration:run y migration:revert.
export default new DataSource(opcionesBaseDeDatos)
