import type { PropiedadInterface } from '@/interfaces/PropiedadInterface';

/** Datos que se envían para crear o actualizar una propiedad. El id lo pone el back. */
export type GuardarPropiedadDTO = Omit<PropiedadInterface, 'id'>;
