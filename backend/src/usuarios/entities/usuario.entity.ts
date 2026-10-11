import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export const ROLES = ['ADMIN', 'PROPIETARIO'] as const
export type Rol = (typeof ROLES)[number]

@Entity()
@Check(`"rol" IN ('ADMIN', 'PROPIETARIO')`)
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  nombre: string

  @Column({ type: 'varchar', length: 150, unique: true })
  correo: string

  // Nunca se guarda la contraseña, solo su hash (bcrypt). Con select: false tampoco sale en las
  // consultas normales: solo se pide a propósito al iniciar sesión.
  @Column({ type: 'varchar', length: 100, select: false })
  contrasenaHash: string

  @Column({ type: 'varchar', length: 20, default: 'PROPIETARIO' })
  rol: Rol
}
