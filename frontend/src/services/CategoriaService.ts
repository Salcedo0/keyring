import type { GuardarCategoriaDTO } from '@/dtos/GuardarCategoriaDTO'
import type { Categoria } from '@/interfaces/CategoriaInterface'

import { http } from './http'

/** Lista todas las categorías de transacción. */
export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await http.get<Categoria[]>('/categorias')
  return respuesta.data
}

/** Crea una categoría nueva (solo ADMIN). */
export async function crearCategoria(datos: GuardarCategoriaDTO): Promise<Categoria> {
  const respuesta = await http.post<Categoria>('/categorias', datos)
  return respuesta.data
}

/** Cambia el nombre o el tipo de una categoría (solo ADMIN). */
export async function actualizarCategoria(
  id: number,
  datos: GuardarCategoriaDTO,
): Promise<Categoria> {
  const respuesta = await http.put<Categoria>(`/categorias/${id}`, datos)
  return respuesta.data
}

/** Elimina una categoría (solo ADMIN). */
export async function eliminarCategoria(id: number): Promise<void> {
  await http.delete(`/categorias/${id}`)
}
