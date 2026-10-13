import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { UsuariosService } from '../usuarios/usuarios.service.js';
import { ES_PUBLICA, ES_SOLO_ADMIN } from './decoradores.js';
import type { PeticionAutenticada, UsuarioDelToken } from './sesion.js';

/**
 * Revisa cada petición antes de que llegue al controlador (patrón de la guía de Nest):
 * 1. Si la ruta es @Publica(), la deja pasar.
 * 2. Si no, exige un token válido en "Authorization: Bearer <token>".
 * 3. Comprueba que el usuario del token todavía exista y guarda su id y su rol actual.
 * 4. Si la ruta es @SoloAdmin(), además exige el rol ADMIN.
 */
@Injectable()
export class AutenticacionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usuariosService: UsuariosService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    if (this.tieneMarca(contexto, ES_PUBLICA)) return true;

    const peticion = contexto.switchToHttp().getRequest<PeticionAutenticada>();
    const token = this.extraerToken(peticion);
    if (!token) throw new UnauthorizedException('Debes iniciar sesión');

    let contenido: UsuarioDelToken;
    try {
      contenido = await this.jwtService.verifyAsync<UsuarioDelToken>(token);
    } catch {
      throw new UnauthorizedException('Tu sesión venció. Inicia sesión de nuevo.');
    }

    // Un token sigue siendo válido hasta que vence, aunque el ADMIN haya eliminado la cuenta.
    // Por eso se busca el usuario: si ya no existe, se rechaza; y el rol sale de la base de
    // datos, no del token, para que un cambio de rol aplique de inmediato.
    const usuario = await this.usuariosService.buscarPorId(contenido.sub);
    if (!usuario)
      throw new UnauthorizedException('Tu cuenta ya no existe. Inicia sesión de nuevo.');
    peticion.usuario = { sub: usuario.id, rol: usuario.rol };

    if (this.tieneMarca(contexto, ES_SOLO_ADMIN) && peticion.usuario.rol !== 'ADMIN') {
      throw new ForbiddenException('Solo un administrador puede hacer esto');
    }
    return true;
  }

  /** Busca la marca (@Publica, @SoloAdmin) en el método o en el controlador completo. */
  private tieneMarca(contexto: ExecutionContext, marca: string): boolean {
    return this.reflector.getAllAndOverride<boolean>(marca, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
  }

  private extraerToken(peticion: PeticionAutenticada): string | undefined {
    const [tipo, token] = peticion.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}
