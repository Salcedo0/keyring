import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  type OnApplicationBootstrap,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import bcrypt from 'bcryptjs'
import { Repository } from 'typeorm'

import { ROLES, Usuario, type Rol } from './entities/usuario.entity.js'

/** Datos para crear una cuenta. La contraseña llega en texto y aquí se convierte en hash. */
export interface NuevoUsuario {
  nombre: string
  correo: string
  contrasena: string
  rol: Rol
}

/** Cuántos usuarios tiene un rol. */
export interface ResumenRol {
  rol: Rol
  cantidad: number
}

// Cuántas vueltas da bcrypt al calcular el hash: más vueltas, más difícil de adivinar por fuerza bruta.
const VUELTAS_BCRYPT = 10

@Injectable()
export class UsuariosService implements OnApplicationBootstrap {
  private readonly registro = new Logger(UsuariosService.name)

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
  ) {}

  /** Al arrancar, crea el primer ADMIN si todavía no hay ninguno. Sin un ADMIN nadie podría administrar. */
  async onApplicationBootstrap(): Promise<void> {
    const hayAdmin = await this.usuarios.existsBy({ rol: 'ADMIN' })
    if (hayAdmin) return

    const { ADMIN_NOMBRE, ADMIN_CORREO, ADMIN_CONTRASENA } = process.env
    if (!ADMIN_CORREO || !ADMIN_CONTRASENA) {
      this.registro.warn('No hay ningún ADMIN: define ADMIN_CORREO y ADMIN_CONTRASENA en el .env')
      return
    }
    await this.crear({
      nombre: ADMIN_NOMBRE ?? 'Administrador',
      correo: ADMIN_CORREO,
      contrasena: ADMIN_CONTRASENA,
      rol: 'ADMIN',
    })
    this.registro.log(`Se creó el administrador inicial ${ADMIN_CORREO}`)
  }

  listar(rol?: Rol): Promise<Usuario[]> {
    return this.usuarios.find({ where: { rol }, order: { nombre: 'ASC' } })
  }

  /** Cuántos usuarios tiene cada rol, de mayor a menor. */
  async resumenPorRol(): Promise<ResumenRol[]> {
    const resumen = await Promise.all(
      ROLES.map(async (rol) => ({ rol, cantidad: await this.usuarios.countBy({ rol }) })),
    )
    return resumen.sort((a, b) => b.cantidad - a.cantidad)
  }

  /** Lo usa el AutenticacionGuard en cada petición para saber si el usuario del token sigue existiendo. */
  buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarios.findOneBy({ id })
  }

  /** Busca un usuario por correo trayendo también el hash de su contraseña (solo para el login). */
  buscarParaIngreso(correo: string): Promise<Usuario | null> {
    return this.usuarios.findOne({
      where: { correo: correo.trim().toLowerCase() },
      select: { id: true, nombre: true, correo: true, rol: true, contrasenaHash: true },
    })
  }

  async crear(datos: NuevoUsuario): Promise<Usuario> {
    const correo = datos.correo.trim().toLowerCase()
    if (await this.usuarios.existsBy({ correo })) {
      throw new ConflictException('Ya existe una cuenta con ese correo')
    }

    const contrasenaHash = await bcrypt.hash(datos.contrasena, VUELTAS_BCRYPT)
    const guardado = await this.usuarios.save(
      this.usuarios.create({ nombre: datos.nombre.trim(), correo, rol: datos.rol, contrasenaHash }),
    )
    // Se responde sin el hash: nunca debe salir de la base de datos.
    return { id: guardado.id, nombre: guardado.nombre, correo, rol: guardado.rol } as Usuario
  }

  /** Elimina un usuario y, en cascada, sus propiedades, contratos y transacciones. */
  async eliminar(id: number, idDeQuienElimina: number): Promise<void> {
    if (id === idDeQuienElimina) throw new ConflictException('No puedes eliminar tu propia cuenta')

    const { affected } = await this.usuarios.delete({ id })
    if (affected === 0) throw new NotFoundException('El usuario no existe')
  }
}
