import type { ResumenRol, Rol, Usuario } from '@/interfaces/UsuarioInterface'

import { http } from './http'

/** Lista los usuarios (solo ADMIN). Si `rol` es null, trae todos. */
export async function obtenerUsuarios(rol: Rol | null): Promise<Usuario[]> {
  const respuesta = await http.get<Usuario[]>('/usuarios', { params: { rol } })
  return respuesta.data
}

/** Cantidad de usuarios por rol (solo ADMIN). Lo calcula el back. */
export async function obtenerResumenPorRol(): Promise<ResumenRol[]> {
  const respuesta = await http.get<ResumenRol[]>('/usuarios/resumen-por-rol')
  return respuesta.data
}

/** Elimina un usuario (solo ADMIN). */
export async function eliminarUsuario(id: number): Promise<void> {
  await http.delete(`/usuarios/${id}`)
}
