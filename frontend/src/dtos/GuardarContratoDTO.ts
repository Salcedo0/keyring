import type { Contrato } from '@/interfaces/ContratoInterface'

/** Datos que se envían para crear o actualizar un contrato. El back agrega id y propiedadNombre. */
export type GuardarContratoDTO = Omit<Contrato, 'id' | 'propiedadNombre'>
