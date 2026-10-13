import type { IngresoDTO } from '@/dtos/IngresoDTO';
import type { RegistroDTO } from '@/dtos/RegistroDTO';
import type { Sesion } from '@/interfaces/UsuarioInterface';

import { http } from './http';

export class AutenticacionService {
  /** Envía correo y contraseña; el back responde con el token y el usuario. */
  static async ingresar(datos: IngresoDTO): Promise<Sesion> {
    const respuesta = await http.post<Sesion>('/auth/ingresar', datos);
    return respuesta.data;
  }

  /** Crea una cuenta de propietario; el back responde igual que al iniciar sesión. */
  static async registrarse(datos: RegistroDTO): Promise<Sesion> {
    const respuesta = await http.post<Sesion>('/auth/registrarse', datos);
    return respuesta.data;
  }
}
