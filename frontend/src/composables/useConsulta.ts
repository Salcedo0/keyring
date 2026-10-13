import { ref, type Ref } from 'vue';

import { describirError } from '@/services/http';

/** Lo que entrega useConsulta a la vista. */
export interface Consulta<T> {
  datos: Ref<T>;
  cargando: Ref<boolean>;
  error: Ref<string>;
  cargar: () => Promise<void>;
}

/**
 * Maneja los estados de una consulta al back: cargando, error y datos.
 * Evita repetir el mismo try/catch en cada vista.
 *
 * Uso:
 *   const { datos, cargando, error, cargar } = useConsulta(obtenerPropiedades, [])
 *   onMounted(cargar)
 */
export function useConsulta<T>(consultar: () => Promise<T>, valorInicial: T): Consulta<T> {
  const datos = ref(valorInicial) as Ref<T>;
  const cargando = ref(false);
  const error = ref('');
  // Si los filtros cambian rápido, una respuesta vieja y lenta podría llegar de última y tapar la
  // nueva. Cada carga lleva un número y solo la más reciente puede escribir el resultado.
  let ultimaCarga = 0;

  async function cargar(): Promise<void> {
    const estaCarga = ++ultimaCarga;
    cargando.value = true;
    error.value = '';
    try {
      const respuesta = await consultar();
      if (estaCarga === ultimaCarga) datos.value = respuesta;
    } catch (problema) {
      if (estaCarga === ultimaCarga) {
        error.value = describirError(problema, 'No se pudieron cargar los datos.');
      }
    } finally {
      if (estaCarga === ultimaCarga) cargando.value = false;
    }
  }

  return { datos, cargando, error, cargar };
}
