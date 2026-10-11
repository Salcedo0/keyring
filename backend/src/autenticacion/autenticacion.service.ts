import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcryptjs'

import type { UsuarioDelToken } from '../comun/sesion.js'
import type { Usuario } from '../usuarios/entities/usuario.entity.js'
import { UsuariosService } from '../usuarios/usuarios.service.js'
import type { IngresarDto } from './dto/ingresar.dto.js'
import type { RegistrarseDto } from './dto/registrarse.dto.js'

/** Lo que responde el login y el registro: el token y los datos públicos del usuario. */
export interface Sesion {
  token: string
  usuario: Pick<Usuario, 'id' | 'nombre' | 'correo' | 'rol'>
}

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  /** Revisa correo y contraseña; si coinciden, entrega un token nuevo. */
  async ingresar(datos: IngresarDto): Promise<Sesion> {
    const usuario = await this.usuariosService.buscarParaIngreso(datos.correo)
    const contrasenaCorrecta =
      usuario !== null && (await bcrypt.compare(datos.contrasena, usuario.contrasenaHash))

    // El mismo mensaje para "no existe" y "contraseña mala", para no revelar qué correos existen.
    if (!usuario || !contrasenaCorrecta) {
      throw new UnauthorizedException('Correo o contraseña incorrectos')
    }
    return this.crearSesion(usuario)
  }

  /** Crea una cuenta de PROPIETARIO y deja la sesión iniciada. */
  async registrarse(datos: RegistrarseDto): Promise<Sesion> {
    const usuario = await this.usuariosService.crear({ ...datos, rol: 'PROPIETARIO' })
    return this.crearSesion(usuario)
  }

  private async crearSesion(usuario: Usuario): Promise<Sesion> {
    const contenido: UsuarioDelToken = { sub: usuario.id, rol: usuario.rol }
    return {
      token: await this.jwtService.signAsync(contenido),
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    }
  }
}
