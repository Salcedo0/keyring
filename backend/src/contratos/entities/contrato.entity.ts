import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Relation } from 'typeorm'

import { Propiedad } from '../../propiedades/entities/propiedad.entity.js'

export const TIPOS_CONTRATO = ['CORTA', 'FIJA'] as const
export type TipoContrato = (typeof TIPOS_CONTRATO)[number]

export const ESTADOS_CONTRATO = ['ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO'] as const
export type EstadoContrato = (typeof ESTADOS_CONTRATO)[number]

/**
 * Datos del inquilino. No es una tabla aparte: sus columnas viven dentro de la tabla de contratos
 * (inquilinoNombre, inquilinoCorreo…), pero la API los entrega agrupados en "inquilino".
 */
export class Inquilino {
  @Column({ type: 'varchar', length: 100 })
  nombre: string

  @Column({ type: 'varchar', length: 30 })
  documento: string

  @Column({ type: 'varchar', length: 150 })
  correo: string

  @Column({ type: 'varchar', length: 30, default: '' })
  telefono: string
}

@Entity()
@Check(`"tipo" IN ('CORTA', 'FIJA')`)
@Check(`"estado" IN ('ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO')`)
@Check(`"fechaFin" > "fechaInicio"`)
@Check(`"valor" > 0`)
export class Contrato {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer' })
  propiedadId: number

  @ManyToOne(() => Propiedad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propiedadId' })
  propiedad: Relation<Propiedad>

  @Column(() => Inquilino)
  inquilino: Inquilino

  @Column({ type: 'varchar', length: 5 })
  tipo: TipoContrato

  /** Formato AAAA-MM-DD. Se guarda como texto para que la zona horaria nunca cambie el día. */
  @Column({ type: 'varchar', length: 10 })
  fechaInicio: string

  @Column({ type: 'varchar', length: 10 })
  fechaFin: string

  /** Pesos colombianos, sin decimales. Total de la estadía, o canon mensual si es FIJA. */
  @Column({ type: 'integer' })
  valor: number

  @Column({ type: 'varchar', length: 12, default: 'PENDIENTE' })
  estado: EstadoContrato
}
