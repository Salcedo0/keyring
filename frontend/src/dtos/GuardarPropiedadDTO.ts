import type { PropiedadInterface } from '@/interfaces/PropiedadInterface';

export type GuardarPropiedadDTO = Omit<PropiedadInterface, 'id'>;
