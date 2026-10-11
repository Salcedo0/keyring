import type { EstadoContrato, TipoContrato } from '@/interfaces/ContratoInterface'
import type { Opcion } from '@/interfaces/OpcionInterface'
import type { Modalidad, TipoPropiedad } from '@/interfaces/PropiedadInterface'
import type { TipoTransaccion } from '@/interfaces/TransaccionInterface'
import type { Rol } from '@/interfaces/UsuarioInterface'

/*
 * Texto en español de cada valor de los enums del dominio. Es la única lista fija del front:
 * los valores los define el contrato de la API, no son datos de negocio.
 */

/** Color de una insignia. Cada tono tiene su fondo y texto en InsigniaEstado.vue. */
export type Tono = 'verde' | 'ambar' | 'gris' | 'rojo' | 'marca'

export const TIPOS_PROPIEDAD: Record<TipoPropiedad, string> = {
  APARTAMENTO: 'Apartamento',
  CASA: 'Casa',
  LOFT: 'Loft',
  ESTUDIO: 'Estudio',
  LOCAL: 'Local comercial',
}

export const MODALIDADES: Record<Modalidad, string> = {
  CORTA: 'Corta estancia',
  FIJA: 'Contrato fijo',
  AMBAS: 'Ambas',
}

export const TONOS_MODALIDAD: Record<Modalidad, Tono> = {
  CORTA: 'marca',
  FIJA: 'ambar',
  AMBAS: 'gris',
}

export const TIPOS_CONTRATO: Record<TipoContrato, string> = {
  CORTA: 'Corta estancia',
  FIJA: 'Contrato fijo',
}

export const ESTADOS_CONTRATO: Record<EstadoContrato, string> = {
  ACTIVO: 'Activo',
  PENDIENTE: 'Pendiente',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
}

export const TONOS_ESTADO_CONTRATO: Record<EstadoContrato, Tono> = {
  ACTIVO: 'verde',
  PENDIENTE: 'ambar',
  FINALIZADO: 'gris',
  CANCELADO: 'rojo',
}

export const TIPOS_TRANSACCION: Record<TipoTransaccion, string> = {
  INGRESO: 'Ingreso',
  GASTO: 'Gasto',
}

export const TONOS_TRANSACCION: Record<TipoTransaccion, Tono> = {
  INGRESO: 'verde',
  GASTO: 'rojo',
}

export const ROLES: Record<Rol, string> = {
  ADMIN: 'ADMIN',
  PROPIETARIO: 'PROPIETARIO',
}

/** Convierte uno de los registros de arriba en opciones para un selector de formulario. */
export function aOpciones<T extends string>(registro: Record<T, string>): Opcion<T>[] {
  return (Object.keys(registro) as T[]).map((valor) => ({ valor, texto: registro[valor] }))
}

/** Igual que aOpciones, pero con una primera opción "todos" (valor null) para los filtros. */
export function aOpcionesConTodos<T extends string>(
  registro: Record<T, string>,
  textoTodos: string,
): Opcion<T | null>[] {
  return [{ valor: null, texto: textoTodos }, ...aOpciones(registro)]
}
