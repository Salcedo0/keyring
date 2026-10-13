import type { TipoTransaccion } from '@/interfaces/TransaccionInterface';

const FORMATO_PESOS = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const MESES_CORTOS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

/** Convierte 1840000 en "$ 1.840.000". */
export function formatearPesos(valor: number): string {
  if (!Number.isFinite(valor)) return FORMATO_PESOS.format(0);
  return FORMATO_PESOS.format(valor);
}

/** Monto con signo según el tipo: ingreso "+$ 1.840.000", gasto "−$ 620.000". */
export function formatearMonto(monto: number, tipo: TipoTransaccion): string {
  const signo = tipo === 'INGRESO' ? '+' : '−';
  return `${signo}${formatearPesos(monto)}`;
}

/** Convierte "2026-09-30" en "30 sep 2026". */
export function formatearFecha(fecha: string): string {
  // Se arma a mano y no con `new Date()` para que la zona horaria no reste un día.
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia} ${MESES_CORTOS[Number(mes) - 1]} ${anio}`;
}

/** Convierte "2026-09" en "sep". Se usa en los ejes de los gráficos. */
export function formatearMes(mes: string): string {
  const numeroMes = Number(mes.split('-')[1]);
  return MESES_CORTOS[numeroMes - 1] ?? mes;
}
