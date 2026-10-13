/** Convierte una fecha en texto AAAA-MM-DD, que es el formato que usa la API. */
function aTextoIso(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Fecha de hoy en formato AAAA-MM-DD. */
export function hoy(): string {
  return aTextoIso(new Date());
}

/** Primer día del mes de hace `meses` meses, en formato AAAA-MM-DD. */
export function inicioDeMesHace(meses: number): string {
  const fecha = new Date();
  fecha.setDate(1);
  fecha.setMonth(fecha.getMonth() - meses);
  return aTextoIso(fecha);
}
