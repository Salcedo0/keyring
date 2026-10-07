/*
 * Colores para los gráficos y el mapa. Chart.js y Leaflet no pueden leer las clases de Tailwind,
 * por eso se repiten aquí. Deben coincidir con el @theme de assets/css/principal.css.
 */
export const COLORES = {
  petroleo: '#0E5160',
  ingreso: '#177A4F',
  gasto: '#E06C62',
  apagado: '#5B6B75',
  rejilla: '#EEF1F3',
}

/** Colores para series sin un color propio (categorías de la dona, roles). */
export const PALETA_CATEGORIAS = ['#0E5160', '#3E97A6', '#E0A23A', '#E06C62', '#9AA9B2', '#7B5EA7']
