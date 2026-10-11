import { createParamDecorator, SetMetadata, type ExecutionContext } from '@nestjs/common'

import type { PeticionAutenticada, UsuarioDelToken } from './sesion.js'

export const ES_PUBLICA = 'esPublica'
export const ES_SOLO_ADMIN = 'esSoloAdmin'

/** La ruta se puede usar sin iniciar sesión (login y registro). */
export const Publica = () => SetMetadata(ES_PUBLICA, true)

/** La ruta solo la puede usar un usuario con rol ADMIN. */
export const SoloAdmin = () => SetMetadata(ES_SOLO_ADMIN, true)

/** Entrega el usuario que inició sesión (lo pone el AutenticacionGuard al leer el token). */
export const UsuarioActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): UsuarioDelToken =>
    contexto.switchToHttp().getRequest<PeticionAutenticada>().usuario,
)
