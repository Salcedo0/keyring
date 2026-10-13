export type Rol = 'ADMIN' | 'PROPIETARIO';

export interface UsuarioInterface {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

/** Cantidad de usuarios que tiene cada rol. Lo calcula el back. */
export interface ResumenRol {
  rol: Rol;
  cantidad: number;
}

/** Lo que responde el back al iniciar sesión. Es también lo que se guarda en el navegador. */
export interface Sesion {
  token: string;
  usuario: UsuarioInterface;
}
