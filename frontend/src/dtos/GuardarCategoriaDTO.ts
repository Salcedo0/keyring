import type { Categoria } from '@/interfaces/CategoriaInterface'

/** Datos que se envían para crear o actualizar una categoría. El id lo pone el back. */
export type GuardarCategoriaDTO = Omit<Categoria, 'id'>
