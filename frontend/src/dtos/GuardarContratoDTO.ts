import type { ContratoInterface } from '@/interfaces/ContratoInterface';

export type GuardarContratoDTO = Omit<ContratoInterface, 'id' | 'propiedadNombre'>;
