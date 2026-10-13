import type { Transaccion } from '@/interfaces/TransaccionInterface'

/** Datos que se envían para crear o actualizar una transacción. El back agrega id y propiedadNombre. */
export type GuardarTransaccionDTO = Omit<Transaccion, 'id' | 'propiedadNombre'>
