import type { TransaccionInterface } from '@/interfaces/TransaccionInterface'

/** Datos que se envían para crear o actualizar una transacción. El back agrega id y propiedadNombre. */
export type GuardarTransaccionDTO = Omit<TransaccionInterface, 'id' | 'propiedadNombre'>
