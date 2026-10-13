import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Relation } from 'typeorm'

import { Contrato } from '../../contratos/entities/contrato.entity.js'
import { Propiedad } from '../../propiedades/entities/propiedad.entity.js'

export const TIPOS_TRANSACCION = ['INGRESO', 'GASTO'] as const
export type TipoTransaccion = (typeof TIPOS_TRANSACCION)[number]

/** Una opción de la lista de categorías (no es una tabla ni una clase del modelo). */
export interface OpcionCategoria {
  nombre: string
  tipo: TipoTransaccion
}

/**
 * Las categorías son una lista fija, no una tabla: el modelo del proyecto se limita a cuatro
 * clases (Usuario, Propiedad, Contrato y Transaccion). Para agregar una, se agrega aquí.
 */
export const CATEGORIAS: OpcionCategoria[] = [
  { nombre: 'Arriendo corta estancia', tipo: 'INGRESO' },
  { nombre: 'Canon de arriendo', tipo: 'INGRESO' },
  { nombre: 'Depósito', tipo: 'INGRESO' },
  { nombre: 'Otros ingresos', tipo: 'INGRESO' },
  { nombre: 'Administración', tipo: 'GASTO' },
  { nombre: 'Mantenimiento', tipo: 'GASTO' },
  { nombre: 'Servicios públicos', tipo: 'GASTO' },
  { nombre: 'Comisión plataforma', tipo: 'GASTO' },
  { nombre: 'Aseo', tipo: 'GASTO' },
  { nombre: 'Impuestos y predial', tipo: 'GASTO' },
]

export const NOMBRES_CATEGORIAS = CATEGORIAS.map((categoria) => categoria.nombre)

@Entity()
@Check(`"tipo" IN ('INGRESO', 'GASTO')`)
@Check(`"monto" > 0`)
export class Transaccion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer' })
  propiedadId: number

  @ManyToOne(() => Propiedad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propiedadId' })
  propiedad: Relation<Propiedad>

  /** Opcional: una reserva o un canon suele venir de un contrato; un gasto de aseo, no. */
  @Column({ type: 'integer', nullable: true })
  contratoId: number | null

  // Si se elimina el contrato, la transacción se conserva, solo que sin contrato.
  @ManyToOne(() => Contrato, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'contratoId' })
  contrato: Relation<Contrato> | null

  @Column({ type: 'varchar', length: 10 })
  tipo: TipoTransaccion

  /** Uno de los nombres de CATEGORIAS, del mismo tipo que la transacción. */
  @Column({ type: 'varchar', length: 60 })
  categoria: string

  /** Pesos colombianos, siempre positivo: el tipo dice si suma o resta. */
  @Column({ type: 'integer' })
  monto: number

  /** Formato AAAA-MM-DD. */
  @Column({ type: 'varchar', length: 10 })
  fecha: string

  @Column({ type: 'varchar', length: 200, default: '' })
  descripcion: string
}
