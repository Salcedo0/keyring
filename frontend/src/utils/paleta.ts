/*
 * Colores para los gráficos y el mapa. Chart.js y Leaflet no pueden leer las clases de Tailwind,
 * por eso se repiten aquí. Deben coincidir con el @theme de assets/css/principal.css.
 */
export const COLORES = {
  marca: '#A35A44',
  ingreso: '#2F7A4F',
  gasto: '#D46A76',
  apagado: '#6E625A',
  rejilla: '#F0E9E2',
};

/** Colores para series sin un color propio (categorías de la dona, roles). */
export const PALETA_CATEGORIAS = ['#A35A44', '#2B2523', '#C9A27E', '#7C9A82', '#D46A76', '#8C8C94'];
