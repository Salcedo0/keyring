export type TipoPropiedad = 'APARTAMENTO' | 'CASA' | 'LOFT' | 'ESTUDIO' | 'LOCAL';

/** CORTA: corta estancia (por noches). FIJA: contrato con canon mensual. AMBAS: según temporada. */
export type Modalidad = 'CORTA' | 'FIJA' | 'AMBAS';

export interface PropiedadInterface {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  tipo: TipoPropiedad;
  modalidad: Modalidad;
  latitud: number | null;
  longitud: number | null;
}
