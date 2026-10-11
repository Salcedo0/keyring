import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Relation } from 'typeorm'

import { Usuario } from '../../usuarios/entities/usuario.entity.js'

export const TIPOS_PROPIEDAD = ['APARTAMENTO', 'CASA', 'LOFT', 'ESTUDIO', 'LOCAL'] as const
export type TipoPropiedad = (typeof TIPOS_PROPIEDAD)[number]

/** CORTA: corta estancia (por noches). FIJA: contrato con canon mensual. AMBAS: según temporada. */
export const MODALIDADES = ['CORTA', 'FIJA', 'AMBAS'] as const
export type Modalidad = (typeof MODALIDADES)[number]

@Entity()
@Check(`"tipo" IN ('APARTAMENTO', 'CASA', 'LOFT', 'ESTUDIO', 'LOCAL')`)
@Check(`"modalidad" IN ('CORTA', 'FIJA', 'AMBAS')`)
export class Propiedad {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  nombre: string

  @Column({ type: 'varchar', length: 200 })
  direccion: string

  @Column({ type: 'varchar', length: 100 })
  ciudad: string

  @Column({ type: 'varchar', length: 15 })
  tipo: TipoPropiedad

  @Column({ type: 'varchar', length: 10 })
  modalidad: Modalidad

  @Column({ type: 'real' })
  latitud: number

  @Column({ type: 'real' })
  longitud: number

  /** Dueño de la propiedad. Cada propietario solo ve las suyas. */
  @Column({ type: 'integer' })
  usuarioId: number

  // Si se elimina el usuario, se eliminan sus propiedades (y en cascada sus contratos y transacciones).
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Relation<Usuario>
}
