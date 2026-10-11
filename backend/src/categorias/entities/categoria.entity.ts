import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export const TIPOS_TRANSACCION = ['INGRESO', 'GASTO'] as const
export type TipoTransaccion = (typeof TIPOS_TRANSACCION)[number]

@Entity()
@Check(`"tipo" IN ('INGRESO', 'GASTO')`)
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 60, unique: true })
  nombre: string

  @Column({ type: 'varchar', length: 10 })
  tipo: TipoTransaccion
}
