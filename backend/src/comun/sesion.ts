import type { Request } from 'express';

import type { Rol } from '../usuarios/entities/usuario.entity.js';

/** Lo que va guardado dentro del token. `sub` es el id del usuario (nombre estándar de JWT). */
export interface UsuarioDelToken {
  sub: number;
  rol: Rol;
}

/** Una petición que ya pasó por el AutenticacionGuard y trae el usuario del token. */
export interface PeticionAutenticada extends Request {
  usuario: UsuarioDelToken;
}
