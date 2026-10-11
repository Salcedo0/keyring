import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Relation } from 'typeorm'

import { Categoria, type TipoTransaccion } from '../../categorias/entities/categoria.entity.js'
import { Contrato } from '../../contratos/entities/contrato.entity.js'
import { Propiedad } from '../../propiedades/entities/propiedad.entity.js'

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

  @Column({ type: 'integer' })
  categoriaId: number

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'categoriaId' })
  categoria: Relation<Categoria>

  /** Pesos colombianos, siempre positivo: el tipo dice si suma o resta. */
  @Column({ type: 'integer' })
  monto: number

  /** Formato AAAA-MM-DD. */
  @Column({ type: 'varchar', length: 10 })
  fecha: string

  @Column({ type: 'varchar', length: 200, default: '' })
  descripcion: string
}
