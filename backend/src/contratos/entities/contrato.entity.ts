import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Relation } from 'typeorm'

import { Propiedad } from '../../propiedades/entities/propiedad.entity.js'

export const TIPOS_CONTRATO = ['CORTA', 'FIJA'] as const
export type TipoContrato = (typeof TIPOS_CONTRATO)[number]

export const ESTADOS_CONTRATO = ['ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO'] as const
export type EstadoContrato = (typeof ESTADOS_CONTRATO)[number]

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

  // Datos del inquilino: son columnas del contrato, no una clase aparte.
  @Column({ type: 'varchar', length: 100 })
  inquilinoNombre: string

  @Column({ type: 'varchar', length: 30 })
  inquilinoDocumento: string

  @Column({ type: 'varchar', length: 150 })
  inquilinoCorreo: string

  @Column({ type: 'varchar', length: 30, default: '' })
  inquilinoTelefono: string

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
