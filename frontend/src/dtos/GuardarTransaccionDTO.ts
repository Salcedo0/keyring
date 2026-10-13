import type { TransaccionInterface } from '@/interfaces/TransaccionInterface';

export type GuardarTransaccionDTO = Omit<TransaccionInterface, 'id' | 'propiedadNombre'>;
